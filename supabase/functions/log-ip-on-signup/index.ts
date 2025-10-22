// supabase/functions/log-ip-on-signup/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "log-ip-on-signup" up and running!`)

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- CHANGE HERE ---
    // 1. Get user data directly from the payload (sent by row_to_json)
    const userRecord = await req.json() // The payload *is* the user record
    // --- END CHANGE ---

    // Basic validation
    // Check for essential fields directly on userRecord
    if (!userRecord || !userRecord.id || !userRecord.email) {
      // Throw the error if validation fails
      throw new Error('Invalid user record received from trigger payload. Missing id or email.')
    }

    // 2. Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('PROJECT_URL') ?? '', // Use PROJECT_URL
      Deno.env.get('SERVICE_ROLE_KEY') ?? '', // Use SERVICE_ROLE_KEY
      { auth: { persistSession: false } }
    )

    // 3. Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                      req.headers.get('cf-connecting-ip') ||
                      'IP not available'

    console.log(`Processing sign-up for user ${userRecord.id} (${userRecord.email}). IP: ${ipAddress}`)

    // 4. Update user metadata
    // Use raw_user_meta_data if present, otherwise start fresh
    const existingMetaData = userRecord.raw_user_meta_data || {};
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userRecord.id,
      {
        user_metadata: {
          ...existingMetaData, // Preserve existing metadata
          registration_ip: ipAddress,
          registered_at: new Date().toISOString()
         }
      }
    )

    if (updateError) {
      console.error(`Failed to update metadata for user ${userRecord.id}:`, updateError)
      throw updateError
    }

    console.log(`Successfully updated metadata for user ${userRecord.id}.`)

    // 5. Return success
    return new Response(JSON.stringify({ message: `IP ${ipAddress} logged for user ${userRecord.id}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in log-ip-on-signup function:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.status || 500,
    })
  }
})