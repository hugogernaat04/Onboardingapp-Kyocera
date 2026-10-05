import type { Config } from 'tailwindcss'

/**
 * Design tokens Kyocera-huisstijl. Pas kleuren en lettertypen HIER aan,
 * ze werken door in de hele app.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kyocera: {
          // Primaire merkkleur (Kyocera-rood). Wit op deze kleur haalt 4.5:1.
          red: '#DC0032',
          'red-dark': '#B8002A',
          'red-soft': '#FDECEF',
        },
        ink: '#111111',
        graphite: '#3A3A3C',
        steel: '#5C5C60', // 6.4:1 op wit
        mist: '#E3E3E5',
        fog: '#F3F3F4',
        success: { DEFAULT: '#12724A', soft: '#E4F4EC' },
        danger: { DEFAULT: '#B3261E', soft: '#FCE9E8' },
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        display: ['"Barlow Semi Condensed"', 'Barlow', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(17 17 17 / 0.06), 0 8px 24px -12px rgb(17 17 17 / 0.18)',
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { '0%': { transform: 'scale(0.96)' }, '60%': { transform: 'scale(1.02)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        rise: 'rise 0.35s ease-out both',
        pop: 'pop 0.28s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config
