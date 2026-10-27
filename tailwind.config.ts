import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Palette de la marque AL MACTOUM, tirée du logo : anthracite + vert menthe
        ink: {
          DEFAULT: '#161C19',
          50: '#F1F5F2',
          100: '#DCE5DF',
          700: '#2A332E',
          800: '#1E2622',
          900: '#161C19',
          950: '#0E1210',
        },
        mint: {
          DEFAULT: '#A3F7C6', // vert menthe du logo : sur fond sombre uniquement
          light: '#C6FBDB',
          dark: '#137044', // version foncée pour le texte sur fond clair (contraste 6:1)
        },
        mist: '#F2F6F3',
        wave: '#1DC3EB',
        orange: { money: '#FF7900' },
        cash: '#16A34A',
        whatsapp: '#25D366',
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(14, 18, 16, 0.18)',
        lift: '0 22px 45px -18px rgba(14, 18, 16, 0.35)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        // 3 pulsations seulement : une animation décorative ne doit pas tourner en boucle
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.2, 0.6, 0.3, 1) 1.5s 3 both',
      },
    },
  },
  plugins: [],
};

export default config;
