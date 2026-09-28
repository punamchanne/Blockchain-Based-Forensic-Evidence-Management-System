/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // New Green + White Clean Theme
                'forensic-primary': '#10b981', // Emerald 500
                'forensic-primary-hover': '#059669', // Emerald 600
                'forensic-secondary': '#34d399', // Emerald 400
                'forensic-bg': '#ffffff',
                'forensic-card': '#f9fafb', // Gray 50
                'forensic-text': '#111827', // Gray 900
                'forensic-subtext': '#4b5563', // Gray 600
                'success-green': '#059669',
            },
            backgroundImage: {
                'paper-pattern': "radial-gradient(circle at 50% 50%, #f0fdf4 0%, #ffffff 100%)",
                'grid-pattern': "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 0 0 10px rgba(99, 102, 241, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(99, 102, 241, 0.4)' },
                }
            }
        },
    },
    plugins: [],
}
