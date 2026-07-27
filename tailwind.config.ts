import type { Config } from "tailwindcss";

// Tokens point at the CSS custom properties in globals.css so Tailwind follows the theme toggle.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  // The inline theme script always stamps data-theme, so this selector is reliable.
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // themeable tokens
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        text: "var(--text)",
        muted: "var(--muted)",
        card: "var(--card)",
        "card-2": "var(--card-2)",
        line: "var(--border)",
        brand: "var(--brand)",
        "brand-2": "var(--brand-2)",
        accent: "var(--accent)",

        // fixed gradient stops
        g1: "#4f7cff",
        g2: "#8b5cf6",
        g3: "#22d3ee",
        live: "#10b981",

        // fixed dark tokens (hero + nav)
        ink: "#f2f6fb",
        "ink-soft": "#c3ccd9",
        "ink-mute": "#8b97a8",

        // nav
        "nav-bg": "var(--nav-bg)",
        "nav-line": "var(--nav-line)",
        "nav-text": "var(--nav-text)",
        "nav-strong": "var(--nav-strong)",
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "JetBrains Mono",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        card: "var(--radius)",
      },
      boxShadow: {
        soft: "var(--shadow)",
        card: "var(--card-shadow)",
      },
      maxWidth: {
        shell: "1240px",
        wrap: "1120px",
      },
      spacing: {
        nav: "var(--nav-h)",
      },
    },
  },
  plugins: [],
};

export default config;
