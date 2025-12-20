import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#09090b",
          secondary: "#18181b",
          tertiary: "#27272a",
          elevated: "#3f3f46",
        },
        text: {
          primary: "#fafafa",
          secondary: "#e4e4e7",
          tertiary: "#d4d4d8",
          quaternary: "#a1a1aa",
          muted: "#71717a",
        },
        accent: {
          green: {
            DEFAULT: "#10b981",
            light: "#34d399",
            dark: "#059669",
          },
          blue: {
            DEFAULT: "#3b82f6",
            light: "#60a5fa",
            dark: "#2563eb",
          },
          purple: {
            DEFAULT: "#8b5cf6",
            light: "#a78bfa",
            dark: "#7c3aed",
          },
          pink: {
            DEFAULT: "#ec4899",
            light: "#f472b6",
            dark: "#db2777",
          },
          orange: {
            DEFAULT: "#f59e0b",
            light: "#fbbf24",
            dark: "#d97706",
          },
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(255, 255, 255, 0.12)",
        },
        semantic: {
          success: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
          info: "#3b82f6",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        base: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "14px",
        md: "15px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
        "5xl": "48px",
        "6xl": "72px",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      letterSpacing: {
        tight: "-0.02em",
        normal: "-0.01em",
        wide: "0.02em",
        wider: "0.05em",
      },
      lineHeight: {
        tight: "1.1",
        normal: "1.5",
        relaxed: "1.7",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-secondary": "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        "gradient-tertiary": "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        "gradient-accent": "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
        "gradient-hero": "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        "gradient-multi": "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
      },
      boxShadow: {
        "green-glow": "0 4px 20px rgba(16, 185, 129, 0.3)",
        "green-glow-lg": "0 8px 30px rgba(16, 185, 129, 0.4)",
        "blue-glow": "0 4px 20px rgba(59, 130, 246, 0.3)",
        "blue-glow-lg": "0 8px 30px rgba(59, 130, 246, 0.4)",
        "purple-glow": "0 4px 12px rgba(139, 92, 246, 0.2)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "350ms",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        pulse: "pulse 8s ease-in-out infinite",
        "pulse-fast": "pulse 6s ease-in-out infinite",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
}

export default config
