export const theme = {
  colors: {
    bg: {
      primary: '#09090b',
      secondary: '#18181b',
      tertiary: '#27272a',
    },
    accent: {
      green: {
        DEFAULT: '#10b981',
        dark: '#059669',
      },
      blue: {
        DEFAULT: '#3b82f6',
        dark: '#2563eb',
      },
      purple: {
        DEFAULT: '#8b5cf6',
        dark: '#7c3aed',
      },
    },
    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
    },
    border: {
      DEFAULT: '#3f3f46',
      light: '#52525b',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      secondary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      hero: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

export type Theme = typeof theme
