export const CONFIG = {
  site: { locale: "en_US" },

  // ---------------------------------------------------------------------------
  // SEO Settings
  // ---------------------------------------------------------------------------
  seo: {
    titleTemplate: "%s | %n",
    twitterCard: "summary_large_image" as const,
    robots: "index, follow",
  },

  // ---------------------------------------------------------------------------
  // Typography
  // ---------------------------------------------------------------------------
  typography: {
    // Base font size as a percentage. 100 = browser default (16px).
    // 110 = 10% larger or 90 = 10% smaller, across all text, headings, and links simultaneously.
    baseFontSize: 115,
  },

  // ---------------------------------------------------------------------------
  // Font Settings
  // See https://fontsource.org/?variable=true for fonts that can be installed via package registry
  // To change fonts:
  // 1. pnpm install @fontsource-variable/<font-name> (for example 'pnpm add @fontsource-variable/inter'). Install BOTH the sans and mono fonts.
  // 2. Edit src/styles/global.css - swap the @import and --font-sans and --font-mono values
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Design Settings
  // 1. Pick a theme at ui.shadcn.com/themes or generate one with a tool like tweakcn.com
  // 2. Copy the CSS variables block
  // 3. Paste into BELOW with the naming conversion already used
  // ---------------------------------------------------------------------------

  // Editorial palette: warm paper / deep ink neutrals, with a single deep
  // sienna `brand` accent reserved for emphasis (rules, markers, metrics).
  theme: {
    radius: "0.5rem",

    light: {
      background: "oklch(0.9875 0.0035 92)",
      foreground: "oklch(0.205 0.008 60)",
      card: "oklch(0.9975 0.0015 92)",
      cardForeground: "oklch(0.205 0.008 60)",
      popover: "oklch(0.9975 0.0015 92)",
      popoverForeground: "oklch(0.205 0.008 60)",
      primary: "oklch(0.245 0.01 58)",
      primaryForeground: "oklch(0.985 0.003 92)",
      secondary: "oklch(0.955 0.005 88)",
      secondaryForeground: "oklch(0.245 0.01 58)",
      muted: "oklch(0.955 0.005 88)",
      mutedForeground: "oklch(0.505 0.012 65)",
      accent: "oklch(0.945 0.008 85)",
      accentForeground: "oklch(0.245 0.01 58)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.885 0.006 85)",
      input: "oklch(0.885 0.006 85)",
      ring: "oklch(0.505 0.135 46)",
      brand: "oklch(0.505 0.135 46)",
      brandForeground: "oklch(0.985 0.003 92)",
    },

    dark: {
      background: "oklch(0.16 0.008 62)",
      foreground: "oklch(0.955 0.005 88)",
      card: "oklch(0.198 0.009 62)",
      cardForeground: "oklch(0.955 0.005 88)",
      popover: "oklch(0.198 0.009 62)",
      popoverForeground: "oklch(0.955 0.005 88)",
      primary: "oklch(0.93 0.006 88)",
      primaryForeground: "oklch(0.198 0.009 62)",
      secondary: "oklch(0.255 0.01 62)",
      secondaryForeground: "oklch(0.955 0.005 88)",
      muted: "oklch(0.255 0.01 62)",
      mutedForeground: "oklch(0.715 0.012 75)",
      accent: "oklch(0.255 0.01 62)",
      accentForeground: "oklch(0.955 0.005 88)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 11%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.755 0.135 58)",
      brand: "oklch(0.755 0.135 58)",
      brandForeground: "oklch(0.185 0.009 62)",
    },
  },

} as const;
