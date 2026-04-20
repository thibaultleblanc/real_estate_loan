import { Button, Stack, Typography } from "@mui/material";
import { BRAND_COLORS } from "../../themeTokens";

function ScenarioToolbar({ scenario, onExport, onImportRequest, onReset }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.2}
      alignItems={{ xs: "stretch", md: "center" }}
      justifyContent="space-between"
      sx={{
        p: { xs: 1.6, md: 2 },
        borderRadius: 3,
        border: `1px solid ${BRAND_COLORS.divider}`,
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(6px)",
        mb: 2,
      }}
    >
      <Typography sx={{ color: BRAND_COLORS.primary, fontWeight: 700 }}>
        Scenario en cours: etape {scenario.currentStep + 1} / 3
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button variant="contained" color="primary" onClick={onExport}>
          Exporter JSON
        </Button>
        <Button variant="outlined" onClick={onImportRequest}>
          Importer JSON
        </Button>
        <Button variant="text" color="inherit" onClick={onReset}>
          Reinitialiser
        </Button>
      </Stack>
    </Stack>
  );
}

export default ScenarioToolbar;
