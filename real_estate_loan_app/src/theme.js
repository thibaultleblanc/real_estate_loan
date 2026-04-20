import { createTheme } from "@mui/material/styles";
import { BRAND_COLORS } from "./themeTokens";

export const violetTheme = createTheme({
  palette: {
    primary: {
      main: BRAND_COLORS.primary,
      light: BRAND_COLORS.secondary,
      dark: BRAND_COLORS.primaryDark,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: BRAND_COLORS.secondary,
      light: "#A78BFA",
      dark: BRAND_COLORS.accent,
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#252525",
      secondary: "#6B7280",
    },
    divider: BRAND_COLORS.divider,
    action: {
      active: BRAND_COLORS.primary,
      hover: BRAND_COLORS.primaryHover,
      selected: BRAND_COLORS.primarySelected,
      disabled: "#D1D5DB",
    },
  },
  typography: {
    fontFamily: '"Avenir Next", "Trebuchet MS", "Segoe UI", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: BRAND_COLORS.primary,
          "&:hover": {
            backgroundColor: BRAND_COLORS.primaryDark,
          },
        },
        outlined: {
          borderColor: BRAND_COLORS.primary,
          color: BRAND_COLORS.primary,
          "&:hover": {
            backgroundColor: BRAND_COLORS.primaryHover,
            borderColor: BRAND_COLORS.primaryDark,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: "#D1D5DB",
          "&.Mui-checked": {
            color: BRAND_COLORS.primary,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: BRAND_COLORS.primary,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F3F4F6",
          "& .MuiTableCell-root": {
            color: "#252525",
            fontWeight: 600,
            backgroundColor: "#F3F4F6",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: BRAND_COLORS.primary,
            },
          },
        },
      },
    },
  },
});
