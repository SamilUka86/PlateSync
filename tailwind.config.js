/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          bg: '#080D1B',
          secondary: '#0D1425',
          card: '#111A2E',
          elevated: '#17233B',
          border: '#26334D',
        },
        neon: {
          cyan: '#35D9E8',
          violet: '#A855F7',
          blue: '#3988E8',
          gold: '#F5C451',
          success: '#22C58B',
          warning: '#F5B942',
          error: '#F06475',
        },
        slate: {
          100: '#F1F5F9',
          400: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(53, 217, 232, 0.25)',
        'glow-violet': '0 0 20px -3px rgba(168, 85, 247, 0.25)',
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
