export const COLOR_CODES = {
  text: "34deg 20% 93%",
  textlight: "34deg 3% 50%",
  background: "201deg 67% 6%",
  card: "202deg 65% 10%",
  cardLight: "202deg 65% 12%",
  primary: "214deg 80% 56%",
  primaryDark: "212deg 64% 31%",
  secondary: "49deg 77% 61%",
};

export const COLORS = {
  text: `hsl(${COLOR_CODES.text})`,
  textlight: `hsl(${COLOR_CODES.textlight})`,
  background: `hsl(${COLOR_CODES.background})`,
  card: `hsl(${COLOR_CODES.card})`,
  cardLight: `hsl(${COLOR_CODES.cardLight})`,
  primary: `hsl(${COLOR_CODES.primary})`,
  primaryDark: `hsl(${COLOR_CODES.primaryDark})`,
  secondary: `hsl(${COLOR_CODES.secondary})`,
};

// Font Weights
export const WEIGHTS = {
  normal: 400,
  medium: 550,
  bold: 700,
};

export const FONT_SIZE = {
  normal: 18 / 16 + "rem",
  header: 26 / 16 + "rem",
  title: 32 / 16 + "rem",
};

export const SPACINGS_INT = {
  padding: 16, // px
  border_radius: 6, // px
};
export const SPACINGS = {
  padding: SPACINGS_INT.padding + "px",
  border_radius: SPACINGS_INT.border_radius + "px",
};
