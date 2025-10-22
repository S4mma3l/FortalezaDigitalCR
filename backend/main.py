import os
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
# Importar pillow_heif y registrarlo
import pillow_heif
pillow_heif.register_heif_opener()
# ---
from io import BytesIO
import google.generativeai as genai
from dotenv import load_dotenv

# --- Importaciones para Supabase y Email ---
from supabase import create_client, Client
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
# --- FIN Importaciones ---


# --- Carga de dotenv y Configuración ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Clave pública (anon)
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # Clave de servicio (admin)

# --- Configuración Email ---
SMTP_SERVER = os.getenv("SMTP_SERVER") # ej. smtp.gmail.com
SMTP_PORT = int(os.getenv("SMTP_PORT", 587)) # Puerto (587 para TLS)
EMAIL_SENDER = os.getenv("EMAIL_SENDER") # Tu correo desde donde envías
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD") # Contraseña de aplicación o normal
ADMIN_EMAIL_RECIPIENT = os.getenv("ADMIN_EMAIL_RECIPIENT") # Tu correo donde recibes la notificación
# --- FIN Configuración Email ---

# Verificaciones de variables de entorno
if not GOOGLE_API_KEY: print("Advertencia: No se encontró GOOGLE_API_KEY.")
else: genai.configure(api_key=GOOGLE_API_KEY)
if not SUPABASE_URL or not SUPABASE_KEY or not SUPABASE_SERVICE_KEY:
    print("ERROR FATAL: Variables de entorno de Supabase no configuradas.")
    exit() # Salir si Supabase no está configurado
if not SMTP_SERVER or not EMAIL_SENDER or not EMAIL_PASSWORD or not ADMIN_EMAIL_RECIPIENT:
    print("Advertencia: Variables de entorno de Email no configuradas. No se enviarán notificaciones.")


# --- Inicialización FastAPI y CORS ---
app = FastAPI( title="Fortaleza Digital CR - API", description="Backend para el portal de ciberseguridad de Costa Rica.")
origins = [
    "http://localhost:3000",
    "https://s4mma3l.github.io/FortalezaDigitalCR", # Agrega tu URL de producción aquí si es necesario
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Cliente Admin de Supabase ---
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
# --- FIN Cliente Admin ---


# --- Función de autenticación ---
async def get_current_user(request: Request) -> dict:
    """Obtiene el objeto User de Supabase basado en el token Bearer."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autorizado: Falta token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = auth_header.split(" ")[1]
    try:
        temp_supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        user_response = temp_supabase_client.auth.get_user(token)
        user = user_response.user
        if not user:
             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")
        # Devolver como diccionario para consistencia
        return user.dict() if hasattr(user, 'dict') else user
    except Exception as e:
        print(f"Error de autenticación: {type(e).__name__} - {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido o error de autenticación: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
# --- FIN Función de autenticación ---


# --- Endpoints ---
@app.get("/api")
async def root():
    """Endpoint raíz."""
    return {"message": "¡El backend de Fortaleza Digital CR (FastAPI) está activo!"}

@app.post("/api/herramientas/limpiar-metadatos")
async def limpiar_metadatos_imagen(file: UploadFile = File(...)):
    """Limpia metadatos de imágenes (JPEG, PNG, WEBP, HEIC)."""
    try:
        contents = await file.read()
        file_bytes = BytesIO(contents)
        img = Image.open(file_bytes)
        file_bytes.seek(0)
        is_heic = pillow_heif.is_supported(file_bytes) or img.format == "HEIF"
        output_format = "JPEG"; output_media_type = "image/jpeg"
        if is_heic:
            print(f"Detectado formato HEIC/HEIF para '{file.filename}'. Convirtiendo a {output_format}...")
            if img.mode not in ("RGB", "RGBA"): img = img.convert("RGB")
        elif img.format == "PNG":
             output_format = "PNG"; output_media_type = "image/png"
        elif img.format == "WEBP":
             output_format = "WEBP"; output_media_type = "image/webp"

        img_mode = img.mode; img_size = img.size; pixel_data = list(img.getdata())
        img_sin_metadatos = Image.new(img_mode, img_size); img_sin_metadatos.putdata(pixel_data)
        save_options = {'optimize': True}
        cleaned_format_upper = output_format.upper()
        img_to_save = img_sin_metadatos

        if cleaned_format_upper == 'JPEG':
            save_options['quality'] = 95; save_options['icc_profile'] = None; save_options['exif'] = b''
            if img_sin_metadatos.mode == 'RGBA':
                print("Convirtiendo RGBA a RGB para JPEG...");
                rgb_img = Image.new("RGB", img_sin_metadatos.size, (255, 255, 255))
                rgb_img.paste(img_sin_metadatos, mask=img_sin_metadatos.split()[3]); img_to_save = rgb_img
        elif cleaned_format_upper == 'PNG': save_options['icc_profile'] = None
        elif cleaned_format_upper == 'WEBP': save_options['quality'] = 85; save_options['icc_profile'] = None; save_options['exif'] = b''

        buffer = BytesIO(); img_to_save.save(buffer, format=output_format, **save_options); buffer.seek(0)
        base_filename = os.path.splitext(file.filename)[0]; output_extension = output_format.lower()
        clean_filename = f"limpio_{base_filename}.{output_extension}"
        headers = { "Content-Disposition": f'attachment; filename="{clean_filename}"' }

        print(f"Imagen '{file.filename}' procesada. Salida: {output_format}. Opciones: {save_options}")
        return StreamingResponse(buffer, media_type=output_media_type, headers=headers)

    except pillow_heif.HeifError as heif_err:
        print(f"ERROR procesando HEIC: {heif_err}")
        return {"error": f"Error específico al procesar archivo HEIC: {str(heif_err)}."}, 500
    except Exception as e:
        print(f"ERROR procesando imagen: {type(e).__name__} - {e}")
        return {"error": f"No se pudo procesar la imagen. Formatos: JPEG, PNG, WEBP, HEIC. Detalles: {str(e)}"}, 500

@app.post("/api/herramientas/analizar-phishing")
async def analizar_phishing(texto_usuario: str = Form(...)):
    """Analiza texto con IA Gemini para detectar phishing."""
    if not GOOGLE_API_KEY: return {"error": "Servicio IA no configurado."}, 503
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        Actúa como un experto en ciberseguridad de Costa Rica.
        Analiza el siguiente texto en busca de señales de alerta de phishing
        (urgencia, remitente, errores, enlaces, solicitudes de información).
        Tu respuesta DEBE estar en formato MARKDOWN.
        Devuelve un análisis breve y fácil de entender.
        Indica un nivel de riesgo (Bajo, Medio, Alto) y por qué.
        Usa encabezados (###) y negritas (**).
        Texto a analizar:
        ---
        {texto_usuario}
        ---
        """
        response = model.generate_content(prompt)
        return {"analisis_ia": response.text}
    except Exception as e:
        print(f"Error al contactar la IA: {type(e).__name__} - {e}")
        return {"error": f"Error al contactar la IA: {str(e)}"}, 500


# --- Endpoint para Eliminar Cuenta (CORREGIDO) ---
@app.delete("/api/user/delete")
async def delete_user_account(current_user: dict = Depends(get_current_user)):
    """
    Elimina la cuenta del usuario autenticado actual y envía notificación al admin.
    """
    user_id = current_user.get('id')
    user_email = current_user.get('email')

    if not user_id:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="ID de usuario no encontrado después de la autenticación.")

    print(f"Solicitud para eliminar cuenta: Usuario ID={user_id}, Email={user_email}")

    try:
        # --- CORRECCIÓN AQUÍ ---
        # Cambiar user_id=user_id por id=user_id
        delete_response = supabase_admin.auth.admin.delete_user(id=user_id)
        # --- FIN CORRECCIÓN ---

        print(f"Respuesta de Supabase Admin delete_user: {delete_response}") # Loggear respuesta si la hay
        print(f"Usuario {user_id} eliminado exitosamente de Supabase Auth.")

        send_deletion_notification(user_email)

        return {"message": f"Cuenta {user_email} eliminada exitosamente."}

    except Exception as e:
        print(f"Error al eliminar usuario {user_id}: {type(e).__name__} - {e}")
        error_message = str(e)
        if "user not found" in error_message.lower():
             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El usuario no existe o ya fue eliminado.")
        else:
            # Captura el TypeError específico que vimos antes si ocurre por otra razón
            if isinstance(e, TypeError) and "unexpected keyword argument" in error_message:
                 raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error interno: Argumento inesperado al llamar a Supabase. {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error interno al intentar eliminar la cuenta.")

# --- Función para Enviar Email de Notificación ---
def send_deletion_notification(deleted_user_email: str):
    """Envía un correo al administrador notificando la eliminación de una cuenta."""
    if not all([SMTP_SERVER, EMAIL_SENDER, EMAIL_PASSWORD, ADMIN_EMAIL_RECIPIENT]):
        print("WARN: Configuración SMTP incompleta. Omitiendo notificación de eliminación por correo.")
        return

    subject = f"Notificación: Cuenta Eliminada en Fortaleza Digital CR"
    body = f"""
    Se ha eliminado la siguiente cuenta de usuario de Fortaleza Digital CR:

    Correo Electrónico: {deleted_user_email}
    Fecha y Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (Zona horaria del servidor)

    Esta es una notificación automática.
    """

    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = subject
    msg['From'] = EMAIL_SENDER
    msg['To'] = ADMIN_EMAIL_RECIPIENT

    try:
        print(f"Intentando enviar notificación de eliminación a {ADMIN_EMAIL_RECIPIENT} usando {SMTP_SERVER}:{SMTP_PORT}...")
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, ADMIN_EMAIL_RECIPIENT, msg.as_string())
        print(f"Notificación de eliminación enviada exitosamente para {deleted_user_email}.")
    except smtplib.SMTPAuthenticationError:
        print(f"ERROR SMTP: Falló la autenticación para {EMAIL_SENDER}. Verifica usuario/contraseña.")
    except Exception as e:
        print(f"ERROR al enviar notificación de eliminación para {deleted_user_email}: {type(e).__name__} - {e}")

# --- (Comando uvicorn - sin cambios) ---
# uvicorn main:app --reload --port 8000