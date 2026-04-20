import { Box, Typography } from "@mui/material";
import { BRAND_COLORS } from "../../themeTokens";

function Rentability() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 980,
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        background: "linear-gradient(145deg, #F3F4F6 0%, #E5E7EB 100%)",
        border: `1px solid ${BRAND_COLORS.divider}`,
        boxShadow: "0 12px 30px rgba(79, 70, 229, 0.08)",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: BRAND_COLORS.primary, mb: 1 }}
      >
        Rentabilite
      </Typography>
      <Typography sx={{ color: BRAND_COLORS.textSecondary }}>
        Cette etape sera dediee au calcul de rentabilite immobiliere (cashflow,
        rendement brut/net, vacance locative, fiscalite).
      </Typography>
      <Typography sx={{ color: BRAND_COLORS.textSecondary, mt: 1 }}>
        Le placeholder est deja integre au parcours pour preparer l'evolution
        future sans casser les scenarios sauvegardes.
      </Typography>
    </Box>
  );
}

export default Rentability;
