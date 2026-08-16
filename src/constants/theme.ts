export const colors = {
  background: "#F7F9FC",
  backgroundWarm: "#FAFBF8",
  surface: "#FFFFFF",
  surfaceSoft: "#F4F7FB",
  surfaceRaised: "#FBFCFF",
  surfaceBlue: "#EFF6FF",
  glass: "rgba(255, 255, 255, 0.78)",
  glassStrong: "rgba(255, 255, 255, 0.92)",
  glassBlue: "rgba(239, 246, 255, 0.82)",
  glassNavy: "rgba(15, 23, 42, 0.78)",
  primaryLight: "#EFF6FF",
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  primarySoft: "#DBEAFE",
  navy: "#0F172A",
  navySoft: "#172554",
  text: "#0F172A",
  textMuted: "#64748B",
  muted: "#64748B",
  textSubtle: "#94A3B8",
  border: "#E8EDF4",
  borderStrong: "#CBD5E1",
  success: "#059669",
  successSoft: "#DDFBEA",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  white: "#FFFFFF",
  black: "#020617",
  overlay: "rgba(15, 23, 42, 0.38)"
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999
};

export const typography = {
  hero: 38,
  title: 30,
  screenTitle: 28,
  sectionTitle: 20,
  cardTitle: 16,
  body: 16,
  small: 13,
  tiny: 12,
  button: 15
};

export const fontWeights = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const
};

export const layout = {
  screenPadding: 20,
  tabBarHeight: 66,
  floatingTabWidth: 358,
  inputHeight: 54,
  buttonHeight: 52,
  iconButton: 44,
  vendorImage: 172
};

export const motion = {
  fast: 120,
  normal: 220,
  slow: 340,
  stagger: 70,
  easing: {
    standard: "standard"
  },
  spring: {
    friction: 8,
    tension: 115
  },
  softSpring: {
    friction: 10,
    tension: 80
  }
};

export const shadows = {
  soft: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  card: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3
  },
  floating: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5
  },
  glass: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8
  },
  ambient: {
    shadowColor: "#1E40AF",
    shadowOpacity: 0.09,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 4
  }
};

export const shadow = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 3
};
