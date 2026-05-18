// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                navy: "#355872",
                mid: "#7AAACE",
                light: "#9CD5FF",
                white: "#F7F8F0",
                ink: "#1C2E3A",
                muted: "#5A7A8E",
                accent: "#E8A24B",
                surface: "#EDF4F9",
            },
            borderColor: {
                DEFAULT: "rgba(53,88,114,0.15)",
            },
            borderRadius: {
                sm: "6px",
                md: "10px",
                lg: "12px",
            },
            maxWidth: {
                content: "720px",
            },
            transitionDuration: {
                DEFAULT: "150ms",
            },
        },
    },
    plugins: [],
};

export default config;