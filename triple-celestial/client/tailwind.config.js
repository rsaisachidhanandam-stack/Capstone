/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern SaaS Palette
        primary: {
          DEFAULT: "#000000", // Dark mode feel
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        surface: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          DEFAULT: "#FFFFFF",
        },
        border: "#E5E5E5",
        ring: "#d1d5db",
        background: "#FFFFFF",
        sidebar: {
          DEFAULT: "#FAFAFA",
          dark: "#0a0a0a",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      spacing: {
        '68': '17rem',
      },
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
