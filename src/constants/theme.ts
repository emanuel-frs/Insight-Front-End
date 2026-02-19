export const themes = {
  dark: {
    background: "#0B101F",
    card: "#0B101F",
    input: "transparent",
    inputBorder: "#444",
    text: "#fff",
    textMuted: "#888",
    primary: "#fff",
    primaryText: "#0B101F",
    google: "#C8922A",
    apple: "#2A9D8F",
    logoTint: "#fff",
  },
  light: {
    background: "#fff",
    card: "#fff",
    input: "transparent",
    inputBorder: "#ccc",
    text: "#0B101F",
    textMuted: "#999",
    primary: "#0B101F",
    primaryText: "#fff",
    google: "#C8922A",
    apple: "#2A9D8F",
    logoTint: "#0B101F",
  },
};

export type Theme = typeof themes.dark;
