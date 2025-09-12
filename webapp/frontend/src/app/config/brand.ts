// NoWrong Brand Configuration - Production Level Consistency

export const BRAND_CONFIG = {
  // Brand Identity
  name: 'NoWrong',
  tagline: 'Anonymous Intimate Conversations',
  
  // Logo Configuration
  logo: {
    // For now using CSS-based logo, can be replaced with actual image path later
    size: {
      sm: { width: '32px', height: '32px', fontSize: '16px' },
      md: { width: '36px', height: '36px', fontSize: '18px' },
      lg: { width: '40px', height: '40px', fontSize: '20px' }
    },
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-600',
    borderRadius: 'rounded-xl',
    fontWeight: 'font-bold',
    textColor: 'text-white'
  },
  
  // Typography - Updated to match homepage exactly
  typography: {
    brand: {
      fontFamily: 'font-sans', // Inter
      fontWeight: 'font-normal', // 400 weight like homepage
      fontSize: {
        sm: 'text-xl',     // 20px
        md: 'text-2xl',    // 24px (close to homepage's 22px)
        lg: 'text-3xl'     // 30px
      },
      letterSpacing: 'tracking-wider', // 2px spacing like homepage
      background: 'bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 bg-[length:200%_200%]',
      backgroundClip: 'bg-clip-text text-transparent',
      animation: 'animate-gradient-shift', // Matching homepage animation
      symbol: '✦' // Decorative symbol matching homepage
    }
  },
  
  // Color System
  colors: {
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
      400: '#f43f5e', // Accent soft
      500: '#ec4899',
      600: '#db2777', 
      700: '#be185d',
      800: '#9d174d',
      900: '#881337', // Brand secondary
    },
    glass: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.2)',
      dark: 'rgba(0, 0, 0, 0.3)'
    }
  },
  
  // Component Styles
  components: {
    card: {
      background: 'bg-glass-medium',
      backdropBlur: 'backdrop-blur-lg',
      border: 'border border-pink-500/30',
      borderRadius: 'rounded-2xl',
      hover: {
        border: 'hover:border-pink-400',
        background: 'hover:bg-glass-dark',
        scale: 'hover:scale-102'
      },
      transition: 'transition-all duration-300'
    },
    button: {
      primary: {
        background: 'bg-gradient-to-r from-pink-500 to-rose-600',
        text: 'text-white',
        padding: 'px-8 py-3',
        borderRadius: 'rounded-xl',
        fontWeight: 'font-medium',
        hover: 'hover:shadow-lg hover:scale-105',
        transition: 'transition-all duration-300'
      },
      secondary: {
        background: 'bg-gray-700',
        text: 'text-gray-400',
        disabled: 'cursor-not-allowed'
      }
    }
  },
  
  // Layout Configurations
  layout: {
    maxWidth: 'max-w-4xl',
    spacing: {
      section: 'space-y-10',
      cards: 'gap-4',
      cardPadding: 'p-4'
    },
    margins: {
      bottom: 'mb-8',
      section: 'mb-10'
    }
  }
} as const

// Gender-specific username suggestions
export const USERNAME_SUGGESTIONS = {
  male: {
    prefixes: ['Alpha', 'King', 'Master', 'Boss', 'Stud', 'Beast', 'Wild', 'Dark'],
    suffixes: ['Wolf', 'King', 'Beast', 'Stud', 'Master', 'Dom', 'Bull', 'Tiger'],
    adjectives: ['Strong', 'Bold', 'Wild', 'Hard', 'Deep', 'Raw', 'Tough', 'Hot']
  },
  female: {
    prefixes: ['Queen', 'Goddess', 'Lady', 'Princess', 'Sexy', 'Wild', 'Hot', 'Sweet'],
    suffixes: ['Queen', 'Goddess', 'Babe', 'Girl', 'Angel', 'Star', 'Cat', 'Fox'],
    adjectives: ['Sexy', 'Sweet', 'Wild', 'Hot', 'Soft', 'Pink', 'Cute', 'Juicy']
  },
  other: {
    // Mix of both + neutral options
    prefixes: ['Wild', 'Dark', 'Free', 'Pure', 'Sweet', 'Hot', 'Cool', 'Mystic'],
    suffixes: ['Soul', 'Heart', 'Spirit', 'Fire', 'Star', 'Moon', 'Dream', 'Vibe'],
    adjectives: ['Wild', 'Free', 'Bold', 'Pure', 'Cool', 'Warm', 'Soft', 'Bright']
  }
} as const

// Online count formatting
export const formatOnlineCount = (count: number): string => {
  return `${count} online`
}

// Consistent animations
export const ANIMATIONS = {
  cardHover: {
    scale: 1.02,
    y: -2
  },
  cardTap: {
    scale: 0.98
  },
  slideIn: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }
} as const

export default BRAND_CONFIG