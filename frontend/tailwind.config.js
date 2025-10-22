/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { // <-- Colores dentro de extend
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },
      // --- PALETA MONOCROMÁTICA CORREGIDA (SIN ANIDAR) ---
      colors: {
        // Colores primarios (Teal)
        'primary': '#432E54',        // Teal oscuro (acciones, enlaces)
        'primary-dark': '#D4C9BE',   // Teal muy oscuro (hover fuerte, títulos secundarios?)
        'primary-light': '#E0F2F5', // Teal muy claro (fondos sutiles, hover suave)

        // Color de acento (Opcional)
        'accent': '#E5A84D',         // Oro/Mostaza
        'accent-light': '#FFF8ED',   // Oro muy claro

        // Escala de Grises/Negros personalizada (Opcional, si no te gustan los de Tailwind)
        // Si comentas esta sección, se usarán los grises por defecto de Tailwind
        gray: {
          50: '#FDFDFD',   // Fondo principal (blanco roto)
          100: '#F7F7F7',  // Fondo alternativo claro
          200: '#EAEAEA',  // Bordes sutiles
          300: '#DCDCDC',
          400: '#B0B0B0',  // Iconos o texto muy secundario
          500: '#8C8C8C',  // Texto secundario
          600: '#50589C',  // Texto párrafos
          700: '#3C467B',  // Texto principal
          800: '#4B4376',  // Texto muy oscuro / Títulos secundarios
          900: '#11224E',  // Casi negro / Títulos principales
        },
      }
      // --- FIN PALETA ---
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};