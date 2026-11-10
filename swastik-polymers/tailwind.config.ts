import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/config/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#FFFFFF",
          canvas: "#FFFFFF",
          cream: "#F3F3F1",
          beige: "#F3F3F1",   // legacy alias -> light gray
          stone: "#EDEDEB",
          border: "#E1E1DE",
          ink: "#161616",     // near-black editorial surface
          espresso: "#0E0E0E",
          charcoal: "#1A1A1A",
          muted: "#6B6B6B",
          // single bold accent: industrial orange (replaces gold)
          gold: "#F2521B",
          amber: "#FF6A33",
          accent: "#F2521B",
          // legacy dark tones -> near black
          brown: "#161616",
          chocolate: "#0E0E0E"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.05), 0 8px 24px -12px rgba(0,0,0,0.12)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 12px 32px -16px rgba(0,0,0,0.14)",
        lift: "0 2px 6px rgba(0,0,0,0.08), 0 28px 56px -22px rgba(0,0,0,0.24)",
        glow: "0 10px 40px -12px rgba(242,82,27,0.45)"
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FF6A33 0%, #F2521B 100%)",
        "brown-gradient": "linear-gradient(160deg, #1C1C1C 0%, #0E0E0E 100%)",
        "ink-gradient": "linear-gradient(160deg, #1C1C1C 0%, #0E0E0E 100%)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1.25rem",
        "3xl": "2rem"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "bob": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(5px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        bob: "bob 1.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;
