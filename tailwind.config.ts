import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        dialog: "url('./images/modalBG.png')",
        "text-primary": "linear-gradient(91deg, #F083C8 -21.8%, #FFF 86.73%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2.5xl": "1.5rem",
        "3xl": "3.125rem",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        wrapper: "rgba(0,0,0,0.85)",
        "primary-overlay": "rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        'fade-in': 'fade-in 0.2s ease-in-out'
      },
      boxShadow: {
        "wrapper-shadow":
          "0px 4px 40px 0px rgba(34, 255, 255, 0.50) inset, 0px 4px 60px 0px rgba(255, 255, 255, 0.40), 0px 4px 80px 0px rgba(34, 255, 255, 0.50), 0px 60px 100px 0px rgba(12, 14, 18, 0.80)",
        "button-shadow": "0px 12px 18px -3px rgba(34, 255, 255, 0.89)",
        "footer-btn": "0px 4px 30px 0px rgba(34, 255, 255, 0.67)",
      },
      backdropBlur: {
        xs: "3px",
        sm: "10px",
      },
      fontSize: {
        xxs: ["0.625rem", "0.625rem"],
        "2xxs": ["0.5rem", "0.5rem"],
        "4.5xl": ["2.5rem", "2.5rem"],
        "6.5xl": ["4rem", "4rem"],
      },
      spacing: {
        17: "4.375rem",
        18: "4.5rem",
        30: "7.5rem",
        52: "13rem",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
