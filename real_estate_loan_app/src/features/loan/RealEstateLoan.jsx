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
import { PieChart, pieClasses, BarChart, barClasses } from "@mui/x-charts";
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
    onFieldChange("tauxAnnuel", nextValue);
  }

  function updateTauxAssuranceAnnuel(nextValue) {
    onFieldChange("tauxAssuranceAnnuel", nextValue);
  }

  function updateTauxFraisGarantie(nextValue) {
    onFieldChange("tauxFraisGarantie", nextValue);
  }

  const montantMax = Math.max(0, Math.round(metrics.montantMax || 0));
  const montantAssurance = Math.max(0, Math.round(metrics.totalAssurance || 0));

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
    {
      id: 3,
      value: Math.max(0, Math.round(metrics.fraisGarantie || 0)),
      label: "Frais de garantie : ",
      color: BRAND_COLORS.warningStrong,
    },
    {
      id: 4,
      value: Math.max(0, Math.round(metrics.fraisNotaire || 0)),
      label: "Frais de notaire : ",
      color: BRAND_COLORS.emerald,
    },
  ].filter((item) => item.value > 0);

  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);
  const hasPieData = pieTotal > 0;
  const montantInterets = Math.max(0, Math.round(metrics.totalInterets || 0));
  const totalBar = montantMax + montantInterets + montantAssurance;

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
      {/* Bandeau Capacite d'emprunt */}
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
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Revenu */}
          <Box
            component="fieldset"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              margin: 0,
            }}
          >
            <Box
              component="legend"
              sx={{
                paddingX: 1,
                marginLeft: "-8px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Revenu
            </Box>
            <TextField
              label="Revenu net bancaire mensuel (€)"
              type="number"
              value={
                loan.revenuNetBancaire ||
                Math.round(salaryMetrics?.stableNetMensuel || 0)
              }
              onChange={(e) =>
                onFieldChange("revenuNetBancaire", e.target.value)
              }
              size="small"
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              sx={{ mb: 2, width: "100%" }}
            />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Mensualité maximale ({Math.round(metrics.tauxEndettement * 100)}%
              du net bancaire) : {formatAmount(metrics.mensualiteMax)} €
            </Typography>
          </Box>

          {/* Prêt */}
          <Box
            component="fieldset"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              margin: 0,
            }}
          >
            <Box
              component="legend"
              sx={{
                paddingX: 1,
                marginLeft: "-8px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Prêt
            </Box>
            <Typography gutterBottom sx={{ fontSize: "0.875rem" }}>
              Durée (années) : {loan.duree}
            </Typography>
            <Slider
              value={loan.duree}
              min={10}
              max={25}
              step={1}
              onChange={(_, value) => updateDuree(value)}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />
            <TextField
              label="Taux annuel (%)"
              type="number"
              value={loan.tauxAnnuel}
              onChange={(e) => updateTauxAnnuel(e.target.value)}
              size="small"
              slotProps={{
                htmlInput: { min: 0, step: "any", inputMode: "decimal" },
              }}
              sx={{ mb: 2, width: "100%" }}
            />
            <TextField
              label="Taux assurance emprunteur (%)"
              type="number"
              value={loan.tauxAssuranceAnnuel ?? 0}
              onChange={(e) => updateTauxAssuranceAnnuel(e.target.value)}
              size="small"
              slotProps={{
                htmlInput: { min: 0, step: "any", inputMode: "decimal" },
              }}
              sx={{ mb: 2, width: "100%" }}
            />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Assurance mensuelle estimée :{" "}
              {formatAmount(metrics.assuranceMensuelle)} €
            </Typography>
          </Box>

          {/* Frais */}
          <Box
            component="fieldset"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              margin: 0,
            }}
          >
            <Box
              component="legend"
              sx={{
                paddingX: 1,
                marginLeft: "-8px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Frais
            </Box>
            <TextField
              label="Frais de garantie (%)"
              type="number"
              value={loan.tauxFraisGarantie ?? 2}
              onChange={(e) => updateTauxFraisGarantie(e.target.value)}
              size="small"
              slotProps={{
                htmlInput: { min: 0, step: "any", inputMode: "decimal" },
              }}
              sx={{ mb: 2, width: "100%" }}
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
                  ? `Logement neuf (${Math.round(settings.fraisNotaireNeuf * 100)}% frais)`
                  : `Logement ancien (${Math.round(settings.fraisNotaireAncien * 100)}% frais)`
              }
            />
          </Box>

          {/* Apport */}
          <Box
            component="fieldset"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              margin: 0,
            }}
          >
            <Box
              component="legend"
              sx={{
                paddingX: 1,
                marginLeft: "-8px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Apport
            </Box>
            <Typography gutterBottom sx={{ fontSize: "0.875rem" }}>
              LTV cible : {loan.loanToValue ?? 100}%
            </Typography>
            <Slider
              value={loan.loanToValue ?? 100}
              min={50}
              max={100}
              step={5}
              onChange={(_, value) => onFieldChange("loanToValue", value)}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              sx={{ mb: 2 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mb: 2 }}
            >
              Apport attendu : {formatAmount(metrics.apportAttendu)} €
            </Typography>
            <TextField
              label="Apport (€)"
              type="number"
              value={loan.apport}
              onChange={(e) => onFieldChange("apport", e.target.value)}
              size="small"
              slotProps={{ htmlInput: { min: 0, step: 1000 } }}
              sx={{ mb: 2, width: "100%" }}
            />
          </Box>
        </Box>
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    lg: "140px minmax(320px, 340px)",
                  },
                  alignItems: "start",
                  justifyContent: "center",
                  gap: { xs: 2, lg: 2 },
                }}
              >
                <Box sx={{ width: { xs: "100%", lg: 140 }, mx: "auto" }}>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: ["Emprunt"] }]}
                    series={[
                      {
                        data: [montantMax],
                        label: "Montant emprunté",
                        color: BRAND_COLORS.primary,
                        stack: "total",
                        valueFormatter: (value) =>
                          `${formatAmount(value, 0)} €`,
                        barLabel: (item) =>
                          totalBar > 0
                            ? `${Math.round((item.value / totalBar) * 100)}%`
                            : "",
                      },
                      {
                        data: [montantInterets],
                        label: "Intérêts",
                        color: BRAND_COLORS.secondary,
                        stack: "total",
                        valueFormatter: (value) =>
                          `${formatAmount(value, 0)} €`,
                        barLabel: (item) =>
                          totalBar > 0
                            ? `${Math.round((item.value / totalBar) * 100)}%`
                            : "",
                      },
                      {
                        data: [montantAssurance],
                        label: "Assurance",
                        color: BRAND_COLORS.warning,
                        stack: "total",
                        valueFormatter: (value) =>
                          `${formatAmount(value, 0)} €`,
                        barLabel: (item) =>
                          totalBar > 0 && item.value > 0
                            ? `${Math.round((item.value / totalBar) * 100)}%`
                            : "",
                      },
                    ]}
                    width={100}
                    height={210}
                    margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    hideLegend={true}
                    sx={{
                      [`& .${barClasses.bar}`]: {
                        paintOrder: "stroke",
                      },
                      [`& .${barClasses.label}`]: {
                        fill: "black",
                        fontWeight: "bold",
                        paintOrder: "stroke",
                        stroke: "white",
                        strokeWidth: "2px",
                        strokeLinejoin: "round",
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", lg: 340 },
                    minWidth: { lg: 320 },
                    flexShrink: 0,
                    mx: "auto",
                  }}
                >
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
                    sx={{
                      [`& .${pieClasses.arcLabel}`]: {
                        fill: "black",
                        fontWeight: "bold",
                        paintOrder: "stroke",
                        stroke: "white",
                        strokeWidth: "2px",
                        strokeLinejoin: "round",
                      },
                    }}
                  >
                    <PieCenterLabel>
                      {formatAmount(pieTotal, 0)} €
                    </PieCenterLabel>
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
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Ajuste les paramètres du prêt pour afficher le graphique.
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Capacité d&apos;achat nette :{" "}
              {formatAmount(metrics.capaciteAchatNet, 0)} €
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color:
                  metrics.ltvEffectif > metrics.ltvCible
                    ? "error.main"
                    : "success.main",
              }}
            >
              LTV effectif : {metrics.ltvEffectif}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default RealEstateLoan;
