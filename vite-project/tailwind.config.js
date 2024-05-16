/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                roboto: ["Roboto", "sans-serif"],
            },
            colors: {
                primary: "#32323d",
                secondary: "#696969",
                bgr: "#f9dbdb",
                alpha: "rgba(0, 0, 0, 0.05)",
                dark: "rgba(0, 0, 0, 0.5)",
                hover: "#cc3373",
            },
        },
    },
    plugins: [],
};
