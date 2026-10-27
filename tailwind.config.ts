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
        // Palette de la marque AL MACTOUM
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#EEF2F8',
          100: '#D5DEEC',
          700: '#13305A',
          800: '#0E2647',
          900: '#0B1F3A',
          950: '#06132A',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E2C25A',
          dark: '#876B0F',
        },
        mist: '#F5F7FA',
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
        soft: '0 10px 30px -12px rgba(11, 31, 58, 0.18)',
        lift: '0 22px 45px -18px rgba(11, 31, 58, 0.35)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.2, 0.6, 0.3, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
