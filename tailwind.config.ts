import type { Config } from "tailwindcss";

export default {
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
        sans: [
          "Inter",
          "Pretendard",
          "Noto Sans KR",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // Forest Theme Colors
        forest: "#2F4F4F",
        beige: "#F5F5DC",
        "background-light": "#F5F5DC",
        "background-dark": "#161c1c",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Sound Mind brand colors
        brand: {
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          300: "hsl(var(--brand-300))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
        },
        neutral: {
          0: "hsl(var(--neutral-0))",
          5: "hsl(var(--neutral-5))",
          10: "hsl(var(--neutral-10))",
          20: "hsl(var(--neutral-20))",
          60: "hsl(var(--neutral-60))",
          80: "hsl(var(--neutral-80))",
          90: "hsl(var(--neutral-90))",
        },
        success: {
          50: "hsl(var(--success-50))",
          600: "hsl(var(--success-600))",
        },
        warning: {
          50: "hsl(var(--warning-50))",
          600: "hsl(var(--warning-600))",
        },
        danger: {
          50: "hsl(var(--danger-50))",
          600: "hsl(var(--danger-600))",
        },
      },
      borderRadius: {
        lg: "2rem", // Updated for Forest Theme
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        pill: "9999px",
      },
      boxShadow: {
        "elevation-1": "var(--shadow-1)",
        "elevation-2": "var(--shadow-2)",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
