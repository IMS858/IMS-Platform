import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        // Distinctive display font — already IMS brand
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // Geometric UI sans — characterful but readable
        sans: ['Spline Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // For numbers / data
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // IMS brand
        ink: {
          DEFAULT: '#1A1814',
          50: '#F7F5F1',
          100: '#EFEAE2',
          200: '#D9D2C5',
          300: '#A89F8E',
          400: '#6E6557',
          500: '#3D362C',
          600: '#2B2723',
          700: '#1F1C19',
          800: '#15130F',
          900: '#0C0B09',
          950: '#070605',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F1E8',
          300: '#EDE6D7',
        },
        brand: {
          DEFAULT: '#2A85BE',
          soft: '#EAF4FB', // alias of 50, for backgrounds
          dark: '#175077', // alias of 700, for high-contrast text
          50: '#EAF4FB',
          100: '#D2E8F5',
          200: '#A5D0EB',
          300: '#77B8E1',
          400: '#4AA0D7',
          500: '#2A85BE',
          600: '#1F6B9D',
          700: '#175077',
          800: '#0F3650',
          900: '#081B28',
        },
        // Semantic
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Custom shadows tuned for the cream-on-light look
        card: '0 1px 2px 0 rgba(30, 22, 12, 0.04), 0 1px 3px 0 rgba(30, 22, 12, 0.06)',
        'card-hover': '0 4px 12px -2px rgba(30, 22, 12, 0.08), 0 2px 6px -1px rgba(30, 22, 12, 0.06)',
        'sidebar-inset': 'inset -1px 0 0 rgba(255, 255, 255, 0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
