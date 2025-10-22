# Fortaleza Digital CR 🛡️🇨🇷
**Tu centro de confianza para la ciberseguridad en Costa Rica.**

Este proyecto es un portal web interactivo diseñado para educar y empoderar a los costarricenses con el conocimiento y las herramientas necesarias para navegar seguros en la era digital y protegerse contra el creciente fraude electrónico.

## ✨ Características
* **Guía Interactiva:** Una versión navegable y fácil de leer de la "Guía Definitiva de Seguridad Digital para Costa Rica", administrada desde Supabase.
* **Analizador de Phishing con IA:** Herramienta que utiliza la API de Google Gemini para analizar textos (emails, SMS) sospechosos y evaluar su riesgo.
* **Limpiador de Metadatos:** Permite a los usuarios subir imágenes (JPG, PNG, WEBP, HEIC) para eliminar metadatos sensibles (GPS, EXIF, etc.) antes de compartirlas. Los archivos HEIC se convierten a JPEG.
* **Mi Fortaleza (Checklist Personal):** Una sección para usuarios registrados donde pueden seguir su progreso en la adopción de buenas prácticas de ciberhigiene, guardado de forma segura en Supabase.
* **Directorio de Ayuda:** Información de contacto actualizada de entidades clave en Costa Rica para reportar fraudes y buscar asistencia.
* **Autenticación Segura:** Sistema de registro e inicio de sesión gestionado por Supabase Auth.
* **Registro de IP (Opcional):** Guarda la IP de registro en los metadatos del usuario usando una Supabase Edge Function (con fines de seguridad/auditoría).
* **Eliminación de Cuenta:** Permite a los usuarios eliminar su cuenta y datos asociados, notificando al administrador.

## 💻 Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS
* **Backend:** FastAPI (Python)
* **Base de Datos y Autenticación:** Supabase (PostgreSQL, GoTrue)
* **Funciones Serverless:** Supabase Edge Functions (Deno/TypeScript)
* **IA:** Google Gemini API
* **Procesamiento de Imágenes:** Pillow, Pillow-HEIF (Python)
* **Despliegue Backend:** Railway
* **Despliegue Frontend:** GitHub Pages (vía GitHub Actions)

## 📁 Estructura del Proyecto

/FortalezaDigitalCR | |-- /.github/workflows/ # GitHub Actions para despliegue FE | |-- deploy-frontend.yml | |-- /backend/ # Aplicación FastAPI (Python) | |-- main.py # Código principal de la API | |-- requirements.txt # Dependencias Python | |-- Procfile # Instrucciones de inicio para Railway | |-- .env.example # Archivo de ejemplo para variables de entorno | |-- /frontend/ # Aplicación Next.js (React) | |-- /app/ # Rutas y componentes principales (App Router) | |-- /components/ # Componentes reutilizables | |-- /utils/supabase/ # Clientes Supabase (client, server, build) | |-- next.config.js # Configuración Next.js (export estático) | |-- tailwind.config.js # Configuración Tailwind | |-- postcss.config.js # Configuración PostCSS | |-- package.json # Dependencias Node.js | |-- .env.local.example # Archivo de ejemplo para variables de entorno | |-- /supabase/functions/ # Supabase Edge Functions | |-- /log-ip-on-signup/ # Función para registrar IP | | |-- index.ts | |-- /_shared/ # Archivos compartidos (ej. cors.ts) | |-- cors.ts | |-- .gitignore # Archivos y carpetas a ignorar por Git |-- README.md # Este archivo

## 🚀 Setup e Instalación
**Pre-requisitos:**
* Node.js (v18 o superior recomendado)
* npm (o yarn/pnpm)
* Python (v3.9 o superior recomendado)
* pip
* Supabase CLI (`npm install supabase --save-dev`)
* Git
* (Opcional pero recomendado para funciones Edge) Deno
* (Opcional) Docker Desktop (para pruebas locales de Supabase o si Railway lo necesita)

**Pasos:**
1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/S4mma3l/FortalezaDigitalCR.git](https://github.com/S4mma3l/FortalezaDigitalCR.git)
    cd FortalezaDigitalCR
    ```
2.  **Configurar Supabase:**
    * Crea un proyecto en [supabase.com](https://supabase.com).
    * Ve al **SQL Editor** y ejecuta el script SQL completo y las políticas RLS.
    * Habilita la extensión `pg_net` en **Database -> Extensions**.
    * **Función Edge (Registro IP):**
        * Vincula tu CLI al proyecto: `npx supabase login` y `npx supabase link --project-ref TU_PROJECT_REF`.
        * Configura los secrets:
            ```bash
            npx supabase secrets set PROJECT_URL=https://TU_PROJECT_REF.supabase.co
            npx supabase secrets set SERVICE_ROLE_KEY=TU_CLAVE_DE_SERVICIO
            ```
        * Despliega la función: `npx supabase functions deploy log-ip-on-signup --no-verify-jwt`.
        * Crea el **Trigger** en la base de datos (usando el SQL Editor) para llamar a la función `net.http_post` en `AFTER INSERT ON auth.users`, como se detalló anteriormente.
    * Copia tu **Project URL**, **anon key** y **service role key** desde `Settings -> API`.
3.  **Configurar Backend:**
    * Navega a la carpeta `backend`: `cd backend`
    * Crea un entorno virtual: `python -m venv venv`
    * Activa el entorno:
        * Windows: `.\venv\Scripts\activate`
        * macOS/Linux: `source venv/bin/activate`
    * Instala dependencias: `pip install -r requirements.txt`
        * *Nota:* Puede que necesites dependencias de sistema para `pillow-heif` (ej. `libheif-dev`).
    * Crea un archivo `.env` (copia de `.env.example` si existe) y rellena **todas** las variables: `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY`, `GOOGLE_API_KEY`, `SMTP_SERVER`, `SMTP_PORT`, `EMAIL_SENDER`, `EMAIL_PASSWORD`, `ADMIN_EMAIL_RECIPIENT`.
4.  **Configurar Frontend:**
    * Navega a la carpeta `frontend`: `cd ../frontend`
    * Instala dependencias: `npm install` (o `npm ci`)
    * Crea un archivo `.env.local` (copia de `.env.local.example` si existe) y rellena las variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL` (usa `http://localhost:8000` para desarrollo local).

## ⚙️ Variables de Entorno
**Backend (`backend/.env`):**
* `SUPABASE_URL`: URL de tu proyecto Supabase.
* `SUPABASE_KEY`: Clave pública (anon) de Supabase.
* `SUPABASE_SERVICE_KEY`: Clave secreta de servicio de Supabase.
* `GOOGLE_API_KEY`: Clave API para Google Gemini.
* `SMTP_SERVER`: Servidor SMTP para enviar correos (ej. `smtp.gmail.com`).
* `SMTP_PORT`: Puerto SMTP (ej. `587`).
* `EMAIL_SENDER`: Dirección de correo remitente.
* `EMAIL_PASSWORD`: Contraseña del correo (o contraseña de aplicación).
* `ADMIN_EMAIL_RECIPIENT`: Correo donde recibir notificaciones (ej. eliminación de cuenta).

**Frontend (`frontend/.env.local`):**
* `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase (igual que en backend).
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública (anon) de Supabase (igual que `SUPABASE_KEY` en backend).
* `NEXT_PUBLIC_API_URL`: URL base de tu API backend (ej. `http://localhost:8000` en local, URL de Railway en producción).

## ▶️ Ejecutar Localmente
1.  **Iniciar Backend:**
    * Abre una terminal.
    * Navega a la carpeta `backend`.
    * Activa el entorno virtual (`venv\Scripts\activate` o `source venv/bin/activate`).
    * Ejecuta: `uvicorn main:app --reload --port 8000`
2.  **Iniciar Frontend:**
    * Abre **otra** terminal.
    * Navega a la carpeta `frontend`.
    * Ejecuta: `npm run dev`
3.  Abre tu navegador en `http://localhost:3000`.

## ☁️ Despliegue
* **Backend:** Configurado para desplegar en [Railway](https://railway.app/) usando el `Procfile`. Las variables de entorno se configuran en el dashboard de Railway.
* **Frontend:** Configurado para exportación estática (`output: 'export'`) y despliegue en [GitHub Pages](https://pages.github.com/) mediante el workflow de GitHub Actions (`.github/workflows/deploy-frontend.yml`). Las variables `NEXT_PUBLIC_*` se pasan al build a través de los Secrets del repositorio de GitHub.

## 🤝 Contribuciones (Opcional)
Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request.