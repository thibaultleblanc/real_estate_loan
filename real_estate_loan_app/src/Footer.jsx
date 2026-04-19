import {
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Box,
} from "@mui/material";

function Footer() {
  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0, left: 0 }}>
      <BottomNavigation
        showLabels
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.96)",
          borderTop: "1px solid #E5E7EB",
          backdropFilter: "blur(8px)",
        }}
      >
        <BottomNavigationAction
          label={
            <Typography
              variant="body2"
              align="center"
              sx={{ width: "100%", color: "#6B7280" }}
            >
              © 2025 - Réalisé avec Material UI
            </Typography>
          }
        />
      </BottomNavigation>
    </Box>
  );
}

export default Footer;
