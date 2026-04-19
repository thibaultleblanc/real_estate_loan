import { createTheme } from "@mui/material/styles";

export const violetTheme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5",
      light: "#8B5CF6",
      dark: "#4338CA",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8B5CF6",
      light: "#A78BFA",
      dark: "#7C3AED",
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
    divider: "#E5E7EB",
    action: {
      active: "#4F46E5",
      hover: "rgba(79, 70, 229, 0.08)",
      selected: "rgba(79, 70, 229, 0.12)",
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
          backgroundColor: "#4F46E5",
          "&:hover": {
            backgroundColor: "#4338CA",
          },
        },
        outlined: {
          borderColor: "#4F46E5",
          color: "#4F46E5",
          "&:hover": {
            backgroundColor: "rgba(79, 70, 229, 0.08)",
            borderColor: "#4338CA",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: "#D1D5DB",
          "&.Mui-checked": {
            color: "#4F46E5",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#4F46E5",
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
              borderColor: "#4F46E5",
            },
          },
        },
      },
    },
  },
});
