/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F5F3EE',
        ink: '#141414',
        muted: '#6B6B6B',
        line: '#E2DED5',
        accent: '#6D28D9',
        accentSoft: '#A78BFA',
        dark: {
          bg: '#0E0E0E',
          ink: '#EDEDED',
          muted: '#8A8A8A',
          line: '#1F1F1F',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter2: '-0.03em',
      },
      fontSize: {
        micro: ['10px', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
    },
  },
  plugins: [],
}
