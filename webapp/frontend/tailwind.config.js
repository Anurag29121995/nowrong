/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Kupid Brand Colors (matching landing page)
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Main pink
          600: '#db2777',
          700: '#be185d', // Brand primary
          800: '#9d174d',
          900: '#831843',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4', 
          400: '#f43f5e', // Accent soft
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#881337', // Brand secondary
        },
        dark: {
          50: '#1a1a1a',
          100: '#111111',
          200: '#0f0f0f',
          300: '#0a0a0a',
          400: '#080808',
          500: '#000000', // Pure black
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        glass: {
          light: 'rgba(15, 8, 12, 0.4)',
          medium: 'rgba(15, 8, 12, 0.6)',
          dark: 'rgba(15, 8, 12, 0.8)',
        },
        'glass-light': 'rgba(0, 0, 0, 0.1)',
        'glass-medium': 'rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F43F5E 0%, #BE185D 50%, #881337 100%)',
        'gradient-mesh': `
          radial-gradient(at 20% 30%, rgba(190, 24, 93, 0.15) 0px, transparent 45%),
          radial-gradient(at 80% 70%, rgba(244, 63, 94, 0.1) 0px, transparent 50%),
          radial-gradient(at 40% 90%, rgba(136, 19, 55, 0.12) 0px, transparent 40%)
        `,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(190, 24, 93, 0.4), 0 0 40px rgba(190, 24, 93, 0.2)',
        'glow-lg': '0 0 30px rgba(190, 24, 93, 0.5), 0 0 60px rgba(190, 24, 93, 0.3)',
      },
      scale: {
        '102': '1.02',
      },
      animation: {
        'gradient-shift': 'gradientShift 4s ease-in-out infinite',
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sparkle: {
          '0%, 100%': { 
            opacity: '0.6', 
            transform: 'scale(1) rotate(0deg)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.2) rotate(180deg)' 
          },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(-100%)', opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}