import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mana Colors
        mana: {
          white: '#F8F6D8',
          blue: '#0E68AB',
          black: '#150B00',
          red: '#D3202A',
          green: '#00733E',
          colorless: '#CAC5C0',
          gold: '#FCBA03',
        },
        // UI Colors - MTG Theme
        mtg: {
          dark: '#1a1612',
          darker: '#0f0d0a',
          card: '#2d261f',
          cardLight: '#3d3429',
          border: '#4a4035',
          gold: '#c9a227',
          goldLight: '#dbb842',
          mythic: '#f5832a',
          rare: '#c9a227',
          uncommon: '#b0b7bd',
          common: '#1a1612',
          text: '#e8e0d5',
          textMuted: '#a89f91',
          textDark: '#6b6358',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Crimson Text', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(135deg, #3d3429 0%, #2d261f 50%, #1a1612 100%)',
        'gradient-gold': 'linear-gradient(135deg, #dbb842 0%, #c9a227 50%, #a88620 100%)',
        'gradient-mythic': 'linear-gradient(135deg, #f5832a 0%, #e06a1a 50%, #c95d15 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'glow-gold': '0 0 20px rgba(201, 162, 39, 0.4)',
        'glow-mythic': '0 0 20px rgba(245, 131, 42, 0.4)',
        'glow-white': '0 0 15px rgba(248, 246, 216, 0.3)',
        'glow-blue': '0 0 15px rgba(14, 104, 171, 0.4)',
        'glow-black': '0 0 15px rgba(21, 11, 0, 0.6)',
        'glow-red': '0 0 15px rgba(211, 32, 42, 0.4)',
        'glow-green': '0 0 15px rgba(0, 115, 62, 0.4)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
