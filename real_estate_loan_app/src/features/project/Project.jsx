import {
  Box,
  FormControlLabel,
  Paper,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  calculateProjectMetrics,
  formatAmount,
} from "../../utils/calculations";
import {
  PROJECT_FORMAT,
  PROJECT_LABELS,
  PROJECT_NUMERIC_BOUNDS,
} from "../../constants/project";
import { BRAND_GRADIENTS } from "../../themeTokens";

function parsePercent(value) {
  const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function parsePositiveNumber(value) {
  const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function calculateMonthlyPayment(amount, years, annualRate) {
  const mensualites = Math.max(0, years) * 12;
  if (mensualites <= 0 || amount <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return amount / mensualites;
  }

  return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -mensualites));
}

function Project({ project, settings, salaryMetrics, onFieldChange }) {
  const { hasParking, prixM2, prixM2HorsParking } =
    calculateProjectMetrics(project);
  const valeurBien = parsePositiveNumber(project?.valeurBien);
  const revenuNetBancaire = parsePositiveNumber(
    project?.revenuNetBancaire ||
      Math.round(salaryMetrics?.stableNetMensuel || 0),
  );
  const montantEmprunte = parsePositiveNumber(project?.montantEmprunte);
  const dureePret = Math.max(
    1,
    Math.round(Number.parseFloat(String(project?.dureePret ?? 20)) || 20),
  );
  const tauxAnnuelPret = parsePercent(project?.tauxAnnuelPret);
  const tauxAssurancePret = parsePercent(project?.tauxAssurancePret);

  const assuranceMensuelle = (montantEmprunte * (tauxAssurancePret / 100)) / 12;
  const remboursementMensuel = calculateMonthlyPayment(
    montantEmprunte,
    dureePret,
    tauxAnnuelPret,
  );
  const mensualiteTotale = remboursementMensuel + assuranceMensuelle;
  const loanToValue =
    valeurBien > 0 ? (montantEmprunte / valeurBien) * 100 : null;
  const seuilEndettement = Number(settings?.tauxEndettement ?? 0.35);
  const seuilEndettementPercent =
    seuilEndettement <= 1 ? seuilEndettement * 100 : seuilEndettement;
  const tauxEndettementActuel =
    revenuNetBancaire > 0 ? (mensualiteTotale / revenuNetBancaire) * 100 : null;
  const debtRatioColor =
    tauxEndettementActuel === null
      ? "text.secondary"
      : tauxEndettementActuel <= seuilEndettementPercent
        ? "success.main"
        : "error.main";

  function updateDureePret(value) {
    const nextValue = Array.isArray(value) ? value[0] : value;
    onFieldChange("dureePret", nextValue);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
        width: "100%",
      }}
    >
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
        {PROJECT_LABELS.banner}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: { xs: "100%", md: "90%" },
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
          }}
        >
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
              {PROJECT_LABELS.sectionBien}
            </Box>

            <TextField
              label={PROJECT_LABELS.fieldValeurBien}
              type="number"
              value={project?.valeurBien ?? ""}
              onChange={(event) =>
                onFieldChange("valeurBien", event.target.value)
              }
              size="small"
              slotProps={{
                htmlInput: {
                  min: PROJECT_NUMERIC_BOUNDS.min,
                  step: PROJECT_NUMERIC_BOUNDS.stepCurrency,
                },
              }}
              sx={{ mb: 2, width: "100%" }}
            />

            <TextField
              label={PROJECT_LABELS.fieldSurface}
              type="number"
              value={project?.surface ?? ""}
              onChange={(event) => onFieldChange("surface", event.target.value)}
              size="small"
              slotProps={{
                htmlInput: {
                  min: PROJECT_NUMERIC_BOUNDS.min,
                  step: PROJECT_NUMERIC_BOUNDS.stepSurface,
                },
              }}
              sx={{ mb: 1.5, width: "100%" }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.5,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={hasParking}
                    onChange={(event) =>
                      onFieldChange("hasParking", event.target.checked)
                    }
                    color="primary"
                  />
                }
                label={PROJECT_LABELS.parking}
                sx={{ m: 0, minWidth: 160 }}
              />

              <TextField
                label={PROJECT_LABELS.fieldValeurParking}
                type="number"
                value={project?.valeurParking ?? ""}
                onChange={(event) =>
                  onFieldChange("valeurParking", event.target.value)
                }
                disabled={!hasParking}
                size="small"
                slotProps={{
                  htmlInput: {
                    min: PROJECT_NUMERIC_BOUNDS.min,
                    step: PROJECT_NUMERIC_BOUNDS.stepCurrency,
                  },
                }}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>

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
              {PROJECT_LABELS.sectionRevenu}
            </Box>

            <TextField
              label={PROJECT_LABELS.fieldRevenuNetBancaire}
              type="number"
              value={
                project?.revenuNetBancaire ||
                Math.round(salaryMetrics?.stableNetMensuel || 0)
              }
              onChange={(event) =>
                onFieldChange("revenuNetBancaire", event.target.value)
              }
              size="small"
              slotProps={{
                htmlInput: {
                  min: PROJECT_NUMERIC_BOUNDS.min,
                  step: PROJECT_NUMERIC_BOUNDS.stepCurrency,
                },
              }}
              sx={{ width: "100%" }}
            />
          </Box>

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
              {PROJECT_LABELS.sectionPret}
            </Box>

            <TextField
              label={PROJECT_LABELS.fieldMontantEmprunte}
              type="number"
              value={project?.montantEmprunte ?? ""}
              onChange={(event) =>
                onFieldChange("montantEmprunte", event.target.value)
              }
              size="small"
              slotProps={{
                htmlInput: {
                  min: PROJECT_NUMERIC_BOUNDS.min,
                  step: PROJECT_NUMERIC_BOUNDS.stepCurrency,
                },
              }}
              sx={{ mb: 2, width: "100%" }}
            />

            <Typography gutterBottom sx={{ fontSize: "0.875rem" }}>
              {PROJECT_LABELS.fieldDureePret} : {dureePret}
            </Typography>
            <Slider
              value={dureePret}
              min={10}
              max={25}
              step={1}
              onChange={(_, value) => updateDureePret(value)}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <TextField
              label={PROJECT_LABELS.fieldTauxAnnuelPret}
              type="number"
              value={project?.tauxAnnuelPret ?? ""}
              onChange={(event) =>
                onFieldChange("tauxAnnuelPret", event.target.value)
              }
              size="small"
              slotProps={{
                htmlInput: {
                  min: PROJECT_NUMERIC_BOUNDS.min,
                  step: "any",
                  inputMode: "decimal",
                },
              }}
              sx={{ mb: 2, width: "100%" }}
            />

            <TextField
              label={PROJECT_LABELS.fieldTauxAssurancePret}
              type="number"
              value={project?.tauxAssurancePret ?? ""}
              onChange={(event) =>
                onFieldChange("tauxAssurancePret", event.target.value)
              }
              size="small"
              slotProps={{
                htmlInput: {
                  min: PROJECT_NUMERIC_BOUNDS.min,
                  step: "any",
                  inputMode: "decimal",
                },
              }}
              sx={{ width: "100%" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
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
            {PROJECT_LABELS.sectionResume}
          </Box>

          <Paper sx={{ p: 1.5, mt: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {formatAmount(prixM2, PROJECT_FORMAT.currencyDigits)} € / m²
            </Typography>
            {hasParking ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 0.5 }}
              >
                {formatAmount(prixM2HorsParking, PROJECT_FORMAT.currencyDigits)}{" "}
                € hors parking
              </Typography>
            ) : null}
          </Paper>

          <Paper sx={{ p: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {project?.montantEmprunte
                ? `${formatAmount(mensualiteTotale)} € / mois`
                : "xx€ / mois"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 0.25 }}
            >
              {project?.montantEmprunte
                ? `${formatAmount(remboursementMensuel)} € emprunt`
                : "xx€ emprunt"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {project?.montantEmprunte
                ? `${formatAmount(assuranceMensuelle)} € assurance`
                : "xx€ assurance"}
            </Typography>
          </Paper>

          <Paper sx={{ p: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {PROJECT_LABELS.debtRatio} :{" "}
              <Box
                component="span"
                sx={{ color: debtRatioColor, fontWeight: 600 }}
              >
                {tauxEndettementActuel !== null
                  ? `${formatAmount(tauxEndettementActuel, PROJECT_FORMAT.currencyDigits)} %`
                  : "-"}
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {PROJECT_LABELS.loanToValue} :{" "}
              {loanToValue !== null
                ? `${formatAmount(loanToValue, PROJECT_FORMAT.currencyDigits)} %`
                : "-"}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Project;
