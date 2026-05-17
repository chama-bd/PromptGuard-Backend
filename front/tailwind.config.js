/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#185FA5',
        },
        sidebar: {
          DEFAULT: '#0D1B3E',
        },
        blue: {
          light: '#E6F1FB',
          dark: '#0C447C',
        },
        accent: {
          DEFAULT: '#534AB7',
          light: '#EEEDFE',
        },
        success: {
          DEFAULT: '#1D9E75', // Updated to match charts palette
          light: '#EAF3DE',
        },
        warning: {
          DEFAULT: '#EF9F27', // Updated to match charts palette
          light: '#FAEEDA',
        },
        danger: {
          DEFAULT: '#E24B4A', // Updated to match charts palette
          light: '#FCEBEB',
        },
        background: {
          page: '#F0F4FF', // Light blue tint
          card: '#FFFFFF',
          surface: '#F1EFE8',
        },
        text: {
          primary: '#1C2833',
          secondary: '#5F5E5A',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-lg': ['22px', { fontWeight: '600' }],
        'heading-md': ['18px', { fontWeight: '600' }],
        'heading-sm': ['15px', { fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.7', fontWeight: '400' }],
        'label': ['12px', { letterSpacing: '0.06em', fontWeight: '500' }],
        'section-label': ['11px', { letterSpacing: '0.08em', fontWeight: '600', textTransform: 'uppercase' }],
      },
      borderRadius: {
        'card': '10px',
        'btn': '8px',
        'input': '8px',
        'pill': '20px',
      },
      transitionProperty: {
        'interactive': 'background-color, border-color, color, fill, stroke, transform',
      },
      transitionDuration: {
        'DEFAULT': '150ms',
      },
      transitionTimingFunction: {
        'DEFAULT': 'ease',
      }
    },
  },
  plugins: [],
}
