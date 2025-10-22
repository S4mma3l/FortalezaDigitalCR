"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Verificar sesión y escuchar cambios
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    checkSession();

    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === "SIGNED_OUT" && window.location.pathname.startsWith('/mi-fortaleza')) {
             router.push('/login');
             router.refresh();
        }
      }
    );

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, [supabase.auth, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    // Fondo blanco, sombra md, sticky
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="container max-w-6xl px-4 py-3 mx-auto md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-y-2 md:flex-nowrap md:gap-y-0">
          <Link href="/" className="text-xl md:text-2xl font-heading font-bold text-primary hover:text-primary-dark transition-colors duration-200"> {/* Color logo primario */}
             Fortaleza Digital CR
          </Link>
          <div className="flex items-center justify-end flex-grow space-x-3 md:space-x-5 text-sm md:flex-grow-0">
            {/* Enlaces con fondo claro en hover */}
            <Link href="/guia" className="text-gray-700 hover:text-primary px-2 py-1 rounded hover:bg-primary-light transition-colors duration-200">Guía</Link>
            <Link href="/herramientas" className="text-gray-700 hover:text-primary px-2 py-1 rounded hover:bg-primary-light transition-colors duration-200">Herramientas</Link>
            <Link href="/directorio-ayuda" className="text-gray-700 hover:text-primary px-2 py-1 rounded hover:bg-primary-light transition-colors duration-200">Ayuda</Link>

            <div className="hidden md:block w-px h-5 bg-gray-300 mx-2"></div>

            {user ? (
              <>
                <Link href="/mi-fortaleza" className="font-semibold text-primary hover:text-primary-dark px-2 py-1">Mi Fortaleza</Link>
                <button onClick={handleLogout} className="btn-danger !px-3 !py-1 !text-xs !uppercase">
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary !py-1.5 !px-4 !text-xs">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}