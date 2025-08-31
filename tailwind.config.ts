export default {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                cream: '#fdf6ec',
                siamBrown: '#6b4f3f',
                pastelBlue: '#a7c5bd',
                pastelPink: '#f4c2c2',
            },
            fontFamily: {
                sans: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
            },
        },
    },
};
