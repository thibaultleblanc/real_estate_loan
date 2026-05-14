import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { BRAND_COLORS, BRAND_GRADIENTS } from "../themeTokens";

const STEPS = ["Salaire", "Emprunt", "Rentabilite"];

function Header({ currentStep, onStepChange }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        mb: 3,
        background: BRAND_GRADIENTS.header,
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          py: 2,
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2.2, color: "rgba(255,255,255,0.9)" }}
          >
            Parcours Investisseur
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            Salaire, Emprunt, Rentabilite
          </Typography>
        </Box>
        <Tabs
          value={currentStep}
          onChange={(_, value) => onStepChange(value)}
          variant="fullWidth"
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 2,
            minHeight: 54,
            ".MuiTabs-indicator": {
              height: 3,
              backgroundColor: BRAND_COLORS.warning,
            },
            ".MuiTab-root": {
              color: "rgba(255,255,255,0.95)",
              minHeight: 54,
              fontWeight: 700,
              letterSpacing: 0.5,
            },
            ".Mui-selected": {
              color: BRAND_COLORS.warning,
            },
          }}
        >
          {STEPS.map((step, index) => (
            <Tab key={step} label={`${index + 1}. ${step}`} />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
