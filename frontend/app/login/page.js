"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- Componente Modal con Texto Final ---
function TermsModal({ onClose }) {
  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Cerrar"
        >
          &times; {/* Símbolo de 'x' */}
        </button>

        <h2 className="text-xl font-heading font-semibold text-brand-darkblue mb-4 border-b pb-2">
          Términos, Condiciones y Política de Privacidad de Fortaleza Digital CR
        </h2>
        <p className="text-xs text-gray-500 mb-4">Fecha de última actualización: 21 de octubre de 2025</p>

        {/* --- CONTENIDO DEL MODAL (TEXTO FINAL) --- */}
        <div className="prose prose-sm max-w-none text-gray-700">
          <p>Bienvenido a Fortaleza Digital CR. Al acceder, navegar o registrarse en este sitio web (en adelante, "el Sitio"), usted (en adelante, "el Usuario") acepta y se compromete a cumplir los siguientes Términos y Condiciones de Uso y nuestra Política de Privacidad. Si no está de acuerdo con estos términos, por favor, no utilice el Sitio.</p>

          <h3 className="font-heading text-lg font-semibold text-brand-darkblue mt-6 mb-2">TÉRMINOS Y CONDICIONES DE USO</h3>

          <p><strong>1. Objeto del Sitio</strong></p>
          <p>Fortaleza Digital CR es una plataforma con fines estrictamente educativos e informativos sobre ciberseguridad. Las herramientas, artículos, guías y cualquier otro contenido proporcionado tienen como único objetivo la formación, la concienciación y la práctica en entornos controlados y autorizados (por ejemplo, laboratorios personales o plataformas de "Capture The Flag" - CTF).</p>

          <p><strong>2. Obligaciones del Usuario y Uso Aceptable</strong></p>
          <p>El Usuario se compromete a:</p>
          <ul>
              <li>Utilizar el Sitio y sus contenidos únicamente con fines lícitos, educativos y éticos.</li>
              <li>No utilizar la información o herramientas proporcionadas para realizar actividades ilegales, dañinas, maliciosas o no autorizadas contra sistemas, redes o personas.</li>
              <li>No intentar vulnerar la seguridad del Sitio ni acceder a información no autorizada.</li>
              <li>Mantener la confidencialidad de su contraseña y ser responsable de toda actividad que ocurra bajo su cuenta.</li>
              <li>Proporcionar información veraz y actualizada durante el registro.</li>
          </ul>
          <p>El incumplimiento de estas obligaciones facultará a Fortaleza Digital CR a suspender o cancelar la cuenta del Usuario sin previo aviso y a tomar las acciones legales pertinentes.</p>

          <p><strong>3. Descargo de Responsabilidad General (Exoneración de Responsabilidad)</strong></p>
          <ul>
              <li>La información contenida en el Sitio se proporciona "tal cual", sin garantías de ningún tipo, expresas o implícitas. No garantizamos la exactitud, integridad o actualidad del contenido.</li>
              <li>El uso de cualquier información o herramienta del Sitio es bajo el exclusivo riesgo del Usuario. Fortaleza Digital CR, sus creadores o colaboradores no serán responsables por ningún daño directo, indirecto, incidental, consecuente o de cualquier otro tipo que surja del acceso o uso del Sitio o de la confianza depositada en su contenido.</li>
              <li>Las herramientas proporcionadas (ej. Analizador de Phishing, Limpiador de Metadatos) son experimentales y educativas. No garantizan la detección del 100% de amenazas ni la eliminación completa de todos los metadatos en todos los escenarios posibles.</li>
              <li>No nos responsabilizamos por la interpretación o aplicación que el Usuario dé a la información aquí presentada. La ciberseguridad requiere juicio crítico y adaptación constante.</li>
          </ul>

          <p><strong>4. Propiedad Intelectual</strong></p>
          <p>Todo el contenido original del Sitio, incluyendo textos, gráficos, logotipos, herramientas de software y diseño, es propiedad de Fortaleza Digital CR y está protegido por las leyes de propiedad intelectual. Se prohíbe su reproducción, distribución o modificación sin autorización expresa.</p>

          <p><strong>5. Enlaces a Terceros</strong></p>
          <p>El Sitio puede contener enlaces a sitios web de terceros. No tenemos control sobre el contenido o las políticas de privacidad de dichos sitios y no asumimos ninguna responsabilidad por ellos.</p>

          <p><strong>6. Modificaciones a los Términos</strong></p>
          <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. La fecha de "última actualización" al inicio del documento indicará la vigencia de los cambios. Es responsabilidad del Usuario revisar los términos periódicamente.</p>

          <p><strong>7. Ley Aplicable y Jurisdicción</strong></p>
          <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República de Costa Rica. Cualquier disputa o controversia derivada de la utilización del Sitio será sometida a la jurisdicción de los tribunales competentes de San José, Costa Rica.</p>


          <h3 className="font-heading text-lg font-semibold text-brand-darkblue mt-8 mb-2 pt-4 border-t">POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS</h3>

          <p>Fortaleza Digital CR se compromete a proteger su privacidad de acuerdo con la Ley N° 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales de Costa Rica y estándares internacionales.</p>

          <p><strong>1. Responsable de la Base de Datos</strong></p>
          <p>El responsable del tratamiento de sus datos personales es Fortaleza Digital CR (en adelante "El Responsable").</p>

          <p><strong>2. Datos Personales Recopilados</strong></p>
          <p>Al registrarse, solicitamos un único dato personal de carácter identificativo:</p>
          <ul>
              <li>**Dirección de correo electrónico:** Necesaria para crear y gestionar su cuenta de usuario.</li>
          </ul>
          <p>Adicionalmente, como la mayoría de los sitios web, podemos recopilar datos técnicos de forma automática para el funcionamiento del servicio, como dirección IP, tipo de navegador y cookies estrictamente funcionales.</p>

          <p><strong>3. Finalidad del Tratamiento</strong></p>
          <p>Su dirección de correo electrónico se utiliza con las siguientes finalidades exclusivas:</p>
          <ul>
              <li>**Creación y gestión de su cuenta:** Para identificarle como usuario registrado y permitirle el acceso a las funcionalidades personalizadas (ej. "Mi Fortaleza").</li>
              <li>**Inicio de sesión y seguridad:** Para verificar su identidad al acceder al Sitio.</li>
              <li>**Restablecimiento de contraseña:** Para enviarle instrucciones si olvida su contraseña.</li>
              <li>**Comunicaciones esenciales del servicio:** Ocasionalmente, podríamos enviarle correos relacionados con cambios importantes en el Sitio, los Términos o la seguridad de su cuenta (no marketing).</li>
          </ul>

          <p><strong>4. Base Legal (Legitimación)</strong></p>
          <p>El tratamiento de sus datos se basa en:</p>
          <ul>
              <li>**Su consentimiento explícito:** Otorgado al marcar la casilla de aceptación durante el proceso de registro, después de haber tenido acceso a esta política.</li>
              <li>**La ejecución de la relación contractual/funcional:** Necesitamos su correo para proveerle el servicio de cuenta registrada.</li>
          </ul>

          <p><strong>5. Compromiso de No Divulgación</strong></p>
          <p>Nos comprometemos a **no vender, alquilar, ceder ni compartir su dirección de correo electrónico** con terceros para fines de marketing o cualquier otro propósito no descrito en esta política. Sus datos solo serán accesibles para El Responsable y los proveedores tecnológicos indispensables para el funcionamiento del Sitio (ver punto 8).</p>

          <p><strong>6. Derechos del Titular (Derechos ARCO)</strong></p>
          <p>De conformidad con la Ley 8968, usted tiene derecho a:</p>
          <ul>
              <li>**Acceso:** Conocer qué datos tenemos sobre usted.</li>
              <li>**Rectificación:** Corregir datos inexactos o incompletos.</li>
              <li>**Cancelación:** Solicitar la eliminación de sus datos cuando ya no sean necesarios para los fines que fueron recogidos.</li>
              <li>**Oposición:** Oponerse al tratamiento de sus datos en ciertas circunstancias.</li>
          </ul>
          <p>Para ejercer estos derechos, puede hacerlo a través de la configuración de su perfil (si la funcionalidad existe) o enviando una solicitud formal a s4mma3l@pentestercr.com</p>

          <p><strong>7. Conservación de Datos</strong></p>
          <p>Sus datos personales (correo electrónico) serán conservados únicamente durante el tiempo que mantenga activa su cuenta en Fortaleza Digital CR. Si solicita la eliminación de su cuenta o ejerce su derecho de cancelación, sus datos serán eliminados de forma permanente de nuestras bases de datos activas en un plazo razonable.</p>

          <p><strong>8. Medidas de Seguridad y Transferencias Internacionales</strong></p>
          <ul>
            <li>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra acceso no autorizado, alteración o destrucción.</li>
            <li>Utilizamos proveedores de servicios tecnológicos (como Supabase para la base de datos y autenticación) que pueden estar ubicados fuera de Costa Rica. Estos proveedores cumplen con altos estándares de seguridad y privacidad (como GDPR o certificaciones equivalentes). Al registrarse, acepta esta posible transferencia internacional necesaria para el funcionamiento del servicio.</li>
          </ul>


          <p><strong>9. Política de Cookies</strong></p>
          <p>Utilizamos cookies esenciales y funcionales que son necesarias para el funcionamiento del Sitio (ej. mantener su sesión iniciada). No utilizamos cookies de rastreo publicitario o de marketing de terceros.</p>

          <p><strong>10. Autoridad de Control</strong></p>
          <p>Si considera que sus derechos de protección de datos han sido vulnerados, tiene derecho a presentar una denuncia ante la Agencia de Protección de Datos de los Habitantes (PRODHAB) de Costa Rica.</p>
        </div>
        {/* --- FIN DEL CONTENIDO DEL MODAL --- */}

        <div className="mt-6 text-right">
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Componente Principal de la Página de Login (sin cambios en lógica, solo usa el Modal actualizado) ---
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("sign-in");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isTermsAccepted) {
        setMessage("Debes aceptar los Términos y la Política de Privacidad para registrarte.");
        return;
    }
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setMessage(`Error al registrar: ${error.message}`); }
    else {
      setView("sign-in");
      setMessage("¡Registro exitoso! Revisa tu correo para el enlace de confirmación (si está activado).");
      setIsTermsAccepted(false);
      setShowModal(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage(`Error al iniciar sesión: ${error.message}`); }
    else {
      router.push("/mi-fortaleza");
      router.refresh();
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const switchView = (newView) => {
      setView(newView);
      setMessage("");
      setIsTermsAccepted(false);
      setShowModal(false);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {view === "sign-in" ? (
          <form className="space-y-6" onSubmit={handleSignIn}>
            <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input id="email" name="email" type="email" required className="mt-1 form-input" onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input id="password" name="password" type="password" required className="mt-1 form-input" onChange={(e) => setPassword(e.target.value)} value={password} />
            </div>
            <button type="submit" className="w-full btn-primary">
              Ingresar
            </button>
            <p className="text-sm text-center text-gray-600">
              ¿No tienes cuenta?{" "}
              <button type="button" onClick={() => switchView("sign-up")} className="font-medium text-brand-blue hover:underline">Regístrate</button>
            </p>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSignUp}>
            <h2 className="text-2xl font-bold text-center">Crear Cuenta</h2>
            <div>
              <label htmlFor="email-up" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input id="email-up" name="email" type="email" required className="mt-1 form-input" onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div>
              <label htmlFor="password-up" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input id="password-up" name="password" type="password" required minLength={6} className="mt-1 form-input" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Mínimo 6 caracteres" />
            </div>
            <div className="flex items-start space-x-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-1 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                He leído y acepto los{" "}
                <button
                  type="button"
                  onClick={openModal}
                  className="font-medium text-brand-blue hover:underline"
                >
                  Términos, Condiciones y Política de Privacidad
                </button>
                .
              </label>
            </div>
            <button
              type="submit"
              className="w-full btn-secondary"
              disabled={!isTermsAccepted}
            >
              Registrarme
            </button>
            <p className="text-sm text-center text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={() => switchView("sign-in")} className="font-medium text-brand-blue hover:underline">Inicia sesión</button>
            </p>
          </form>
        )}
        {message && <p className={`text-center text-sm mt-4 ${message.includes("Error") || message.includes("Debes aceptar") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
      </div>
      {showModal && <TermsModal onClose={closeModal} />}
    </div>
  );
}