import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', "sans-serif"],
      },
      colors: {
        bg: "#dcf7e7",
        main: "#6e61ff",
        mainAccent: "#ff5710", // not needed for shadcn
        mint: {
          10: "#f1f6f1",
          50: "#dff9f0",
          100: "#cef6e9",
          800: "#b0f0da",
        },
        mustard: {
          50: "#fdffd0",
          100: "#f4f8ac",
          800: "#f1f78e",
        },
        peach: {
          50: "#ffeadd",
          100: "#ffd6bc",
          800: "#ffbc90",
        },
        purple: {
          50: "#efe9fe",
          100: "#d5c8fb",
          700: "#b9a4ff",
          800: "#a88dff",
        },
      },
      borderRadius: {
        base: "10px",
      },
      boxShadow: {
        base: "4px 4px 0px 0px rgba(0,0,0,1)",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwindcss-bg-patterns"),
    // require("@tailwindcss/aspect-ratio"),
  ],
} satisfies Config;

export default config;
