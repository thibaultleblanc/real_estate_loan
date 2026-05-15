import {
  Box,
  FormControl,
  FormControlLabel,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { formatAmount } from "../../utils/calculations";
import { BRAND_COLORS, BRAND_GRADIENTS } from "../../themeTokens";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 18,
  fontWeight: 700,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

function RealEstateLoan({
  loan,
  settings,
  metrics,
  salaryMetrics,
  onFieldChange,
}) {
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

  function updateTauxAssuranceAnnuel(nextValue) {
    const parsed = Number.parseFloat(nextValue);
    onFieldChange(
      "tauxAssuranceAnnuel",
      Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    );
  }

  const montantMax = Math.max(0, Math.round(metrics.montantMax || 0));

  const pieData = [
    {
      id: 0,
      value: montantMax,
      label: "Montant maximal emprunté : ",
      color: BRAND_COLORS.primary,
    },
    {
      id: 1,
      value: Math.max(0, Math.round(metrics.totalInterets || 0)),
      label: "Intérêts : ",
      color: BRAND_COLORS.secondary,
    },
    {
      id: 2,
      value: Math.max(0, Math.round(metrics.totalAssurance || 0)),
      label: "Assurance : ",
      color: BRAND_COLORS.warning,
    },
  ].filter((item) => item.value > 0);

  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);
  const hasPieData = pieTotal > 0;

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
          background: BRAND_GRADIENTS.sectionBanner,
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
        Capacité d&apos;emprunt
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
          <TextField
            label="Revenu net bancaire mensuel (€)"
            type="number"
            value={
              loan.revenuNetBancaire ||
              Math.round(salaryMetrics?.stableNetMensuel || 0)
            }
            onChange={(e) => onFieldChange("revenuNetBancaire", e.target.value)}
            size="small"
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            sx={{ mb: 2 }}
          />
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
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Taux assurance emprunteur (%)"
            type="number"
            value={loan.tauxAssuranceAnnuel ?? 0}
            onChange={(e) => updateTauxAssuranceAnnuel(e.target.value)}
            size="small"
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Apport (€)"
            type="number"
            value={loan.apport}
            onChange={(e) => onFieldChange("apport", e.target.value)}
            size="small"
            slotProps={{ htmlInput: { min: 0, step: 1000 } }}
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
                ? `Logement neuf (${Math.round(settings.fraisNotaireNeuf * 100)}% frais de notaire)`
                : `Logement ancien (${Math.round(settings.fraisNotaireAncien * 100)}% frais de notaire)`
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
          <Box
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 2,
            }}
          >
            {hasPieData ? (
              <Box sx={{ maxWidth: 340, mx: "auto" }}>
                <PieChart
                  height={240}
                  margin={{ top: 12, right: 12, bottom: 56, left: 12 }}
                  series={[
                    {
                      data: pieData,
                      innerRadius: 52,
                      outerRadius: 90,
                      paddingAngle: 3,
                      cornerRadius: 4,
                      arcLabel: (item) =>
                        `${Math.round((item.value / pieTotal) * 100)}%`,
                      arcLabelMinAngle: 12,
                    },
                  ]}
                  hideLegend
                >
                  <PieCenterLabel>{formatAmount(pieTotal, 0)} €</PieCenterLabel>
                </PieChart>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  {pieData.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">
                        {item.label}{" "}
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {formatAmount(item.value, 0)} €
                        </Box>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Ajuste les paramètres du prêt pour afficher le graphique.
              </Typography>
            )}
          </Box>
          <Typography>
            Mensualité maximale ({Math.round(metrics.tauxEndettement * 100)}% du
            net bancaire) : {formatAmount(metrics.mensualiteMax)} €
          </Typography>
          <Typography>
            Assurance mensuelle estimée :{" "}
            {formatAmount(metrics.assuranceMensuelle)} €
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
