import {
  Box,
  FormControl,
  FormControlLabel,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DEBT_RATIO, formatAmount } from "./utils/calculations";

function RealEstateLoan({ loan, metrics, onFieldChange }) {
  function updateDuree(value) {
    if (Array.isArray(value)) {
      onFieldChange("duree", value[0]);
      return;
    }
    onFieldChange("duree", value);
  }

  function updateTauxAnnuel(nextValue) {
    const parsed = Number.parseFloat(nextValue);
    onFieldChange(
      "tauxAnnuel",
      Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 2,
        width: "100%",
      }}
    >
      {/* Bandeau Revenus */}
      <Box
        sx={{
          width: { xs: "95%", md: "90%" },
          background: "linear-gradient(120deg, #4F46E5 0%, #8B5CF6 100%)",
          color: "#fff",
          py: 1,
          px: 2,
          borderRadius: 1,
          mb: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
          letterSpacing: 1,
          mx: "auto",
        }}
      >
        Simulation Prêt Immobilier
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: { xs: "100%", md: "80%" },
          justifyContent: "center",
        }}
      >
        {/* Colonne Inputs */}
        <FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
          <Typography gutterBottom>Duree (annees) : {loan.duree}</Typography>
          <Slider
            value={loan.duree}
            min={10}
            max={25}
            step={1}
            onChange={(_, value) => updateDuree(value)}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Taux annuel (%)"
            type="number"
            value={loan.tauxAnnuel}
            onChange={(e) => updateTauxAnnuel(e.target.value)}
            size="small"
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Apport (€)"
            type="number"
            value={loan.apport}
            onChange={(e) => onFieldChange("apport", e.target.value)}
            size="small"
            inputProps={{ min: 0, step: 1000 }}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={loan.isNeuf}
                onChange={() => onFieldChange("isNeuf", !loan.isNeuf)}
                color="primary"
              />
            }
            label={
              loan.isNeuf
                ? "Logement neuf (2% frais de notaire)"
                : "Logement ancien (8% frais de notaire)"
            }
            sx={{ mt: 1 }}
          />
        </FormControl>
        {/* Colonne Résultats */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}
        >
          <Typography>
            Mensualité maximale ({Math.round(DEBT_RATIO * 100)}% du net mensuel)
            : {formatAmount(metrics.mensualiteMax)} €
          </Typography>
          <Typography>
            Montant maximal empruntable : {formatAmount(metrics.montantMax, 0)}{" "}
            €
          </Typography>
          <Typography>
            Apport personnel : {formatAmount(metrics.apportValue, 0)} €
          </Typography>
          <Typography>
            Frais de notaire estimés : {formatAmount(metrics.fraisNotaire, 0)} €
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            Capacité d&apos;achat nette :{" "}
            {formatAmount(metrics.capaciteAchatNet, 0)} €
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default RealEstateLoan;
