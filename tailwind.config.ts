import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 米克宇宙主色
        mick: {
          violet: "#7362FC",   // 主紫
          magenta: "#FC62E4",  // 洋紅
          purple: "#A562FC",   // 中紫
          blue: "#6283FC",     // 藍紫
          orchid: "#D862FC",   // 蘭紫
          lavender: "#BF8FFE", // 淡紫
        },
        ink: {
          DEFAULT: "#1a1532",
          soft: "#4a4266",
          mute: "#8a83a0",
          whisper: "#c8c3d6",
        },
        canvas: {
          DEFAULT: "#fefcff",
          soft: "#f7f3ff",
          cool: "#f0ebff",
        },
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "Noto Sans TC", "sans-serif"],
        sans: ["Noto Sans TC", "Manrope", "sans-serif"],
        serif: ["Noto Serif TC", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "mick-gradient": "linear-gradient(135deg, #7362FC 0%, #A562FC 40%, #FC62E4 100%)",
        "mick-gradient-soft": "linear-gradient(135deg, #7362FC15 0%, #A562FC15 40%, #FC62E415 100%)",
        "mick-radial": "radial-gradient(circle at 30% 20%, #7362FC20 0%, transparent 50%), radial-gradient(circle at 80% 70%, #FC62E420 0%, transparent 50%)",
      },
      boxShadow: {
        "mick-sm": "0 2px 8px -2px rgba(115, 98, 252, 0.12)",
        "mick-md": "0 8px 24px -8px rgba(115, 98, 252, 0.2)",
        "mick-lg": "0 20px 48px -12px rgba(115, 98, 252, 0.25)",
        "mick-glow": "0 0 0 1px rgba(115, 98, 252, 0.1), 0 8px 32px -8px rgba(252, 98, 228, 0.3)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
