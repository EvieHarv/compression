export const COLOR_CODES = {
  text: "34deg 20% 5%",
  text_light: "34deg 3% 50%",
  background: "60deg 20% 95.1%",
  card: "202deg 65% 10%",
  card_light: "202deg 65% 12%",
  primary: "214deg 80% 56%",
  primary_dark: "212deg 64% 31%",
  secondary: "49deg 77% 61%",
};

export const COLORS = {
  text: `hsl(${COLOR_CODES.text})`,
  text_light: `hsl(${COLOR_CODES.text_light})`,
  background: `hsl(${COLOR_CODES.background})`,
  card: `hsl(${COLOR_CODES.card})`,
  card_light: `hsl(${COLOR_CODES.card_light})`,
  primary: `hsl(${COLOR_CODES.primary})`,
  primary_dark: `hsl(${COLOR_CODES.primary_dark})`,
  secondary: `hsl(${COLOR_CODES.secondary})`,
};

// Media Queries
export const BREAKPOINTS = {
  phone: 700,
  tablet: 1100, // A bit high, but seems to make sense in my mental model. Maybe re-consider this breakpoint.
  laptop: 1500,
};
export const QUERIES = {
  mobileAndSmaller: `max-width: ${BREAKPOINTS.phone / 16}rem`,
  tabletAndSmaller: `max-width: ${BREAKPOINTS.tablet / 16}rem`,
  laptopAndSmaller: `max-width: ${BREAKPOINTS.laptop / 16}rem`,
};

// Font Weights
export const WEIGHTS = {
  normal: 400,
  medium: 550,
  bold: 700,
};

export const FONT_SIZE = {
  smaller: 12 / 16 + "rem",
  normal: 16 / 16 + "rem",
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
