export const colors = {
  primary: {
    light: "#3478F6",
    dark: "#0A84FF"
  },
  secondary: {
    light: "#8A4FFF",
    dark: "#9F7AFA"
  },
  accent: {
    light: "#00C2B8",
    dark: "#00D1C7"
  },
  success: {
    light: "#34C759",
    dark: "#30D158"
  },
  warning: {
    light: "#FF9500",
    dark: "#FF9F0A"
  },
  error: {
    light: "#FF3B30",
    dark: "#FF453A"
  },
  background: {
    light: "#FFFFFF",
    dark: "#000000"
  },
  card: {
    light: "#F2F2F7",
    dark: "#2C2C2E"
  },
  text: {
    primary: {
      light: "#000000",
      dark: "#FFFFFF"
    },
    secondary: {
      light: "#6C6C70",
      dark: "#EBEBF5"
    },
    tertiary: {
      light: "#8E8E93",
      dark: "#EBEBF5"
    }
  },
  border: {
    light: "#E5E5EA",
    dark: "#38383A"
  },
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    dark: "rgba(0, 0, 0, 0.3)"
  }
};

export type ColorScheme = "light" | "dark";

export const getColors = (scheme: ColorScheme) => ({
  primary: colors.primary[scheme],
  secondary: colors.secondary[scheme],
  accent: colors.accent[scheme],
  success: colors.success[scheme],
  warning: colors.warning[scheme],
  error: colors.error[scheme],
  background: colors.background[scheme],
  card: colors.card[scheme],
  text: {
    primary: colors.text.primary[scheme],
    secondary: colors.text.secondary[scheme],
    tertiary: colors.text.tertiary[scheme]
  },
  border: colors.border[scheme],
  shadow: colors.shadow[scheme]
});