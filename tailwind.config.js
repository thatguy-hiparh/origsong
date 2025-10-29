/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1e3a8a', // blue-800
        'primary-50': '#eff6ff', // blue-50
        'primary-100': '#dbeafe', // blue-100
        'primary-200': '#bfdbfe', // blue-200
        'primary-500': '#3b82f6', // blue-500
        'primary-600': '#2563eb', // blue-600
        'primary-700': '#1d4ed8', // blue-700
        'primary-900': '#1e3a8a', // blue-800
        'primary-foreground': '#f8fafc', // slate-50

        // Secondary Colors
        'secondary': '#64748b', // slate-500
        'secondary-50': '#f8fafc', // slate-50
        'secondary-100': '#f1f5f9', // slate-100
        'secondary-200': '#e2e8f0', // slate-200
        'secondary-300': '#cbd5e1', // slate-300
        'secondary-400': '#94a3b8', // slate-400
        'secondary-600': '#475569', // slate-600
        'secondary-700': '#334155', // slate-700
        'secondary-800': '#1e293b', // slate-800
        'secondary-900': '#0f172a', // slate-900
        'secondary-foreground': '#f8fafc', // slate-50

        // Accent Colors
        'accent': '#0ea5e9', // sky-500
        'accent-50': '#f0f9ff', // sky-50
        'accent-100': '#e0f2fe', // sky-100
        'accent-200': '#bae6fd', // sky-200
        'accent-300': '#7dd3fc', // sky-300
        'accent-400': '#38bdf8', // sky-400
        'accent-600': '#0284c7', // sky-600
        'accent-700': '#0369a1', // sky-700
        'accent-800': '#075985', // sky-800
        'accent-900': '#0c4a6e', // sky-900
        'accent-foreground': '#f8fafc', // slate-50

        // Background Colors
        'background': '#0f172a', // slate-900
        'background-secondary': '#1e293b', // slate-800
        'background-tertiary': '#334155', // slate-700

        // Surface Colors
        'surface': '#1e293b', // slate-800
        'surface-secondary': '#334155', // slate-700
        'surface-tertiary': '#475569', // slate-600

        // Text Colors
        'text-primary': '#f8fafc', // slate-50
        'text-secondary': '#94a3b8', // slate-400
        'text-tertiary': '#64748b', // slate-500
        'text-muted': '#475569', // slate-600

        // Status Colors
        'success': '#10b981', // emerald-500
        'success-50': '#ecfdf5', // emerald-50
        'success-100': '#d1fae5', // emerald-100
        'success-200': '#a7f3d0', // emerald-200
        'success-300': '#6ee7b7', // emerald-300
        'success-400': '#34d399', // emerald-400
        'success-600': '#059669', // emerald-600
        'success-700': '#047857', // emerald-700
        'success-800': '#065f46', // emerald-800
        'success-900': '#064e3b', // emerald-900
        'success-foreground': '#f8fafc', // slate-50

        'warning': '#f59e0b', // amber-500
        'warning-50': '#fffbeb', // amber-50
        'warning-100': '#fef3c7', // amber-100
        'warning-200': '#fde68a', // amber-200
        'warning-300': '#fcd34d', // amber-300
        'warning-400': '#fbbf24', // amber-400
        'warning-600': '#d97706', // amber-600
        'warning-700': '#b45309', // amber-700
        'warning-800': '#92400e', // amber-800
        'warning-900': '#78350f', // amber-900
        'warning-foreground': '#f8fafc', // slate-50

        'error': '#ef4444', // red-500
        'error-50': '#fef2f2', // red-50
        'error-100': '#fee2e2', // red-100
        'error-200': '#fecaca', // red-200
        'error-300': '#fca5a5', // red-300
        'error-400': '#f87171', // red-400
        'error-600': '#dc2626', // red-600
        'error-700': '#b91c1c', // red-700
        'error-800': '#991b1b', // red-800
        'error-900': '#7f1d1d', // red-900
        'error-foreground': '#f8fafc', // slate-50

        // Border Colors
        'border': 'rgba(148, 163, 184, 0.2)', // slate-400 with opacity
        'border-secondary': 'rgba(100, 116, 139, 0.3)', // slate-500 with opacity
        'border-tertiary': 'rgba(71, 85, 105, 0.4)', // slate-600 with opacity
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        'header-height': '64px',
        'sidebar-width': '240px',
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1010',
        'fixed': '1020',
        'modal-backdrop': '1030',
        'modal': '1040',
        'popover': '1050',
        'tooltip': '1060',
      },
      animation: {
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 200ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-out-right': 'slideOutRight 300ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-out-left': 'slideOutLeft 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}