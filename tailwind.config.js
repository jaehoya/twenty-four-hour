export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            colors: {
                'primary-blue': '#0D4CFF',
                'secondary-blue': '#33AAFF',
                'light-blue': '#E6F3FF',
                'border-blue': '#1C91FF',
                'text-dark': '#2A2D41',
                'text-gray': '#6D7A91',
                'border-gray': '#DAE0E9',
                'border-light': '#DEE7EF',
                'icon-gray': '#BCC3CD',
            },
            spacing: {
                '15': '15px',
                '20': '20px',
                '7': '28px',
                '9': '36px',
                '11': '44px',
                '13': '52px',
                '14': '56px',
                '17': '68px',
                '18': '72px',
                '19': '76px',
            },
            borderRadius: {
                '15': '15px',
                '20': '20px',
            }
        }
    },
    plugins: [],
}