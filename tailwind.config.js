/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Расширенная нейрофутуристическая палитра
        'neuro': {
          'dark': '#0a0a0f',
          'darker': '#050508',
          'gray': '#1a1a2e',
          'gray-light': '#2a2a4e',
          'purple': '#16213e',
          'purple-light': '#26315e',
          'violet': '#0f3460',
          'violet-light': '#1f4470',
          'cyan': '#533a71',
          'cyan-light': '#634a81',
          'pink': '#6b46c1',
          'pink-light': '#7b56d1',
          'glow': '#8b5cf6',
          'glow-bright': '#a855f7',
          'accent': '#c084fc',
          'accent-bright': '#d8b4fe',
        },
        // Обновленные цвета агентов с градиентными оттенками
        'agent': {
          'geometer': '#3b82f6',
          'geometer-light': '#60a5fa',
          'geometer-dark': '#1d4ed8',
          'physicist': '#dc2626',
          'physicist-light': '#f87171',
          'physicist-dark': '#991b1b',
          'perceptive': '#f59e0b',
          'perceptive-light': '#fbbf24',
          'perceptive-dark': '#d97706',
          'philosopher': '#10b981',
          'philosopher-light': '#34d399',
          'philosopher-dark': '#047857',
          'integrator': '#06b6d4',
          'integrator-light': '#22d3ee',
          'integrator-dark': '#0891b2',
          'observer': '#e5e7eb',
          'observer-light': '#f3f4f6',
          'observer-dark': '#9ca3af',
          'trickster': '#ec4899',
          'trickster-light': '#f472b6',
          'trickster-dark': '#be185d',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'thought-flow': 'thoughtFlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'neural-pulse': 'neuralPulse 3s ease-in-out infinite',
        'matrix-rain': 'matrixRain 1s linear infinite',
        'glow-rotate': 'glowRotate 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(1deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-0.5deg)' },
        },
        thoughtFlow: {
          '0%': { opacity: '0.3', transform: 'translateX(-15px) scale(0.95)' },
          '50%': { opacity: '1', transform: 'translateX(0px) scale(1)' },
          '100%': { opacity: '0.3', transform: 'translateX(15px) scale(0.95)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            opacity: '0.7',
            transform: 'scale(1)',
            filter: 'brightness(1) hue-rotate(0deg)'
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.02)',
            filter: 'brightness(1.2) hue-rotate(10deg)'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        neuralPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)',
            transform: 'scale(1.02)'
          },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        glowRotate: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'neo': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.6)',
        'glow-xl': '0 0 60px rgba(139, 92, 246, 0.8)',
        'neural': '0 8px 32px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'neural-grid': 'radial-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
        'neural-mesh': 'conic-gradient(from 0deg at 50% 50%, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
      },
      backgroundSize: {
        'grid': '20px 20px',
      }
    },
  },
  plugins: [],
} 