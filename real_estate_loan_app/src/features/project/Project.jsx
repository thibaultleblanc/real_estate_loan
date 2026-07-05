import {
  Box,
  FormControlLabel,
  Paper,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import {
  calculateProjectMetrics,
  formatAmount,
} from "../../utils/calculations";
import {
  PROJECT_FORMAT,
  PROJECT_LABELS,
  PROJECT_NUMERIC_BOUNDS,
} from "../../constants/project";
import { BRAND_COLORS, BRAND_GRADIENTS } from "../../themeTokens";

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

function calculateLoanSummary(
  amount,
  years,
  annualRate,
  insuranceRate,
  income,
) {
  const monthlyInsurance = (amount * (insuranceRate / 100)) / 12;
  const monthlyPayment = calculateMonthlyPayment(amount, years, annualRate);
  const monthlyTotal = monthlyPayment + monthlyInsurance;
  const installments = years * 12;
  const totalInterest = Math.max(0, monthlyPayment * installments - amount);
  const totalInsurance = monthlyInsurance * installments;
  const totalLoanCost = totalInterest + totalInsurance;
  const debtRatio = income > 0 ? (monthlyTotal / income) * 100 : null;

  return {
    monthlyInsurance,
    monthlyPayment,
    monthlyTotal,
    totalInterest,
    totalInsurance,
    totalLoanCost,
    debtRatio,
  };
}

function buildAmortizationSeries(amount, years, annualRate, insuranceRate) {
  if (amount <= 0 || years <= 0) {
    return [];
  }

  const monthlyRate = annualRate / 100 / 12;
  const monthlyInsurance = (amount * (insuranceRate / 100)) / 12;
  const monthlyPayment = calculateMonthlyPayment(amount, years, annualRate);
  const monthCount = years * 12;

  let remainingBalance = amount;
  const yearlyBuckets = [];

  for (let monthIndex = 0; monthIndex < monthCount; monthIndex += 1) {
    const interest = monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
    const rawPrincipal = monthlyPayment - interest;
    const principal = Math.min(remainingBalance, Math.max(0, rawPrincipal));
    remainingBalance = Math.max(0, remainingBalance - principal);

    const yearIndex = Math.floor(monthIndex / 12);
    if (!yearlyBuckets[yearIndex]) {
      yearlyBuckets[yearIndex] = {
        year: yearIndex + 1,
        principal: 0,
        interest: 0,
        insurance: 0,
        balance: 0,
      };
    }

    yearlyBuckets[yearIndex].principal += principal;
    yearlyBuckets[yearIndex].interest += interest;
    yearlyBuckets[yearIndex].insurance += monthlyInsurance;
    yearlyBuckets[yearIndex].balance = remainingBalance;
  }

  return yearlyBuckets;
}

function getVariantTileSx(key) {
  if (key === "current") {
    return null;
  }

  return {
    opacity: 0.72,
    transform: { md: "scale(0.96)" },
    transformOrigin: "top center",
  };
}

function getVariantValueSx(key, extraSx = {}) {
  if (key === "current") {
    return { fontWeight: 700, ...extraSx };
  }

  return {
    fontWeight: 600,
    color: "text.secondary",
    ...extraSx,
  };
}

function getTileTitleSx() {
  return {
    fontSize: "0.875rem",
    fontWeight: 600,
    mb: 0.75,
  };
}

function getMetricLabelSx(isVisible) {
  return {
    color: "text.secondary",
    display: "block",
    mb: 0.25,
    visibility: isVisible ? "visible" : "hidden",
  };
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
  const bonTauxAnnuelPret = parsePercent(project?.bonTauxAnnuelPret);
  const tauxAnnuelPret = parsePercent(project?.tauxAnnuelPret);
  const mauvaisTauxAnnuelPret = parsePercent(project?.mauvaisTauxAnnuelPret);
  const bonTauxAssurancePret = parsePercent(project?.bonTauxAssurancePret);
  const tauxAssurancePret = parsePercent(project?.tauxAssurancePret);
  const mauvaisTauxAssurancePret = parsePercent(
    project?.mauvaisTauxAssurancePret,
  );

  const currentSummary = calculateLoanSummary(
    montantEmprunte,
    dureePret,
    tauxAnnuelPret,
    tauxAssurancePret,
    revenuNetBancaire,
  );
  const goodSummary = calculateLoanSummary(
    montantEmprunte,
    dureePret,
    bonTauxAnnuelPret,
    bonTauxAssurancePret,
    revenuNetBancaire,
  );
  const badSummary = calculateLoanSummary(
    montantEmprunte,
    dureePret,
    mauvaisTauxAnnuelPret,
    mauvaisTauxAssurancePret,
    revenuNetBancaire,
  );
  const loanToValue =
    valeurBien > 0 ? (montantEmprunte / valeurBien) * 100 : null;
  const amortizationSeries = buildAmortizationSeries(
    montantEmprunte,
    dureePret,
    tauxAnnuelPret,
    tauxAssurancePret,
  );
  const seuilEndettement = Number(settings?.tauxEndettement ?? 0.35);
  const seuilEndettementPercent =
    seuilEndettement <= 1 ? seuilEndettement * 100 : seuilEndettement;
  const variants = [
    {
      key: "good",
      label: PROJECT_LABELS.goodScenario,
      annualRateValue: project?.bonTauxAnnuelPret ?? "",
      insuranceRateValue: project?.bonTauxAssurancePret ?? "",
      summary: goodSummary,
    },
    {
      key: "current",
      label: PROJECT_LABELS.currentScenario,
      annualRateValue: project?.tauxAnnuelPret ?? "",
      insuranceRateValue: project?.tauxAssurancePret ?? "",
      summary: currentSummary,
    },
    {
      key: "bad",
      label: PROJECT_LABELS.badScenario,
      annualRateValue: project?.mauvaisTauxAnnuelPret ?? "",
      insuranceRateValue: project?.mauvaisTauxAssurancePret ?? "",
      summary: badSummary,
    },
  ];

  function getDebtRatioColor(debtRatio) {
    if (debtRatio === null) {
      return "text.secondary";
    }

    return debtRatio <= seuilEndettementPercent ? "success.main" : "error.main";
  }

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

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 1.5,
                mb: 2,
              }}
            >
              <TextField
                label={PROJECT_LABELS.fieldBonTauxAnnuelPret}
                type="number"
                value={project?.bonTauxAnnuelPret ?? ""}
                onChange={(event) =>
                  onFieldChange("bonTauxAnnuelPret", event.target.value)
                }
                size="small"
                slotProps={{
                  htmlInput: {
                    min: PROJECT_NUMERIC_BOUNDS.min,
                    step: "any",
                    inputMode: "decimal",
                  },
                }}
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
              />

              <TextField
                label={PROJECT_LABELS.fieldMauvaisTauxAnnuelPret}
                type="number"
                value={project?.mauvaisTauxAnnuelPret ?? ""}
                onChange={(event) =>
                  onFieldChange("mauvaisTauxAnnuelPret", event.target.value)
                }
                size="small"
                slotProps={{
                  htmlInput: {
                    min: PROJECT_NUMERIC_BOUNDS.min,
                    step: "any",
                    inputMode: "decimal",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 1.5,
              }}
            >
              <TextField
                label={PROJECT_LABELS.fieldBonTauxAssurancePret}
                type="number"
                value={project?.bonTauxAssurancePret ?? ""}
                onChange={(event) =>
                  onFieldChange("bonTauxAssurancePret", event.target.value)
                }
                size="small"
                slotProps={{
                  htmlInput: {
                    min: PROJECT_NUMERIC_BOUNDS.min,
                    step: "any",
                    inputMode: "decimal",
                  },
                }}
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
              />

              <TextField
                label={PROJECT_LABELS.fieldMauvaisTauxAssurancePret}
                type="number"
                value={project?.mauvaisTauxAssurancePret ?? ""}
                onChange={(event) =>
                  onFieldChange("mauvaisTauxAssurancePret", event.target.value)
                }
                size="small"
                slotProps={{
                  htmlInput: {
                    min: PROJECT_NUMERIC_BOUNDS.min,
                    step: "any",
                    inputMode: "decimal",
                  },
                }}
              />
            </Box>
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
          <Paper sx={{ p: 1.5, mt: 0.5 }}>
            <Typography sx={getTileTitleSx()}>Prix au m²</Typography>
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
            <Typography sx={getTileTitleSx()}>
              {PROJECT_LABELS.monthlyPayment}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              {variants.map((variant) => (
                <Box key={variant.key} sx={getVariantTileSx(variant.key)}>
                  <Typography variant="h6" sx={getVariantValueSx(variant.key)}>
                    {project?.montantEmprunte
                      ? `${formatAmount(variant.summary.monthlyTotal)} €`
                      : "xx€"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={getMetricLabelSx(variant.key === "current")}
                  >
                    Emprunt
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 0.5 }}
                  >
                    {project?.montantEmprunte
                      ? `${formatAmount(variant.summary.monthlyPayment)} €`
                      : "xx€"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={getMetricLabelSx(variant.key === "current")}
                  >
                    Assurance
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {project?.montantEmprunte
                      ? `${formatAmount(variant.summary.monthlyInsurance)} €`
                      : "xx€"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 1.5 }}>
            <Typography sx={getTileTitleSx()}>
              {PROJECT_LABELS.totalLoanCost}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              {variants.map((variant) => (
                <Box key={variant.key} sx={getVariantTileSx(variant.key)}>
                  <Typography
                    variant="h6"
                    sx={getVariantValueSx(variant.key, { mb: 0.5 })}
                  >
                    {project?.montantEmprunte
                      ? `${formatAmount(variant.summary.totalLoanCost)} €`
                      : "xx€"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={getMetricLabelSx(variant.key === "current")}
                  >
                    Intérêts
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 0.5 }}
                  >
                    {project?.montantEmprunte
                      ? `${formatAmount(variant.summary.totalInterest)} €`
                      : "xx€"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={getMetricLabelSx(variant.key === "current")}
                  >
                    Assurance
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {project?.montantEmprunte
                      ? `${formatAmount(variant.summary.totalInsurance)} €`
                      : "xx€"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 1.5 }}>
            <Typography sx={getTileTitleSx()}>Ratios</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              {variants.map((variant) => (
                <Box key={variant.key} sx={getVariantTileSx(variant.key)}>
                  <Typography
                    variant="caption"
                    sx={getMetricLabelSx(variant.key === "current")}
                  >
                    {PROJECT_LABELS.debtRatio}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      ...getVariantValueSx(variant.key),
                      color: getDebtRatioColor(variant.summary.debtRatio),
                      mb: 0.75,
                    }}
                  >
                    {variant.summary.debtRatio !== null
                      ? `${formatAmount(variant.summary.debtRatio, PROJECT_FORMAT.currencyDigits)} %`
                      : "-"}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={getMetricLabelSx(variant.key === "current")}
                  >
                    {PROJECT_LABELS.loanToValue}
                  </Typography>
                  <Typography variant="h6" sx={getVariantValueSx(variant.key)}>
                    {loanToValue !== null
                      ? `${formatAmount(loanToValue, PROJECT_FORMAT.currencyDigits)} %`
                      : "-"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Paper
        sx={{
          width: { xs: "100%", md: "90%" },
          mx: "auto",
          p: 2,
        }}
      >
        <Typography sx={getTileTitleSx()}>
          Tableau d&apos;amortissement
        </Typography>

        {amortizationSeries.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <BarChart
              height={320}
              dataset={amortizationSeries}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "year",
                  label: "Année",
                },
              ]}
              yAxis={[
                {
                  label: "Montant (€)",
                },
              ]}
              series={[
                {
                  dataKey: "principal",
                  label: "Capital remboursé",
                  stack: "amortization",
                  color: BRAND_COLORS.primary,
                },
                {
                  dataKey: "interest",
                  label: "Intérêts",
                  stack: "amortization",
                  color: BRAND_COLORS.secondary,
                },
                {
                  dataKey: "insurance",
                  label: "Assurance",
                  stack: "amortization",
                  color: BRAND_COLORS.warningStrong,
                },
              ]}
              margin={{ left: 70, right: 20, top: 20, bottom: 40 }}
              slotProps={{
                legend: {
                  position: { vertical: "top", horizontal: "right" },
                },
              }}
            />

            <Box>
              <Typography sx={getTileTitleSx()}>Capital restant dû</Typography>
              <LineChart
                height={280}
                dataset={amortizationSeries}
                xAxis={[
                  {
                    scaleType: "point",
                    dataKey: "year",
                    label: "Année",
                  },
                ]}
                yAxis={[
                  {
                    label: "Capital restant (€)",
                  },
                ]}
                series={[
                  {
                    dataKey: "balance",
                    label: "Capital restant dû",
                    color: BRAND_COLORS.accent,
                    showMark: true,
                    curve: "linear",
                  },
                ]}
                margin={{ left: 70, right: 20, top: 20, bottom: 40 }}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              />
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Renseigne un montant emprunté, une durée et un taux courant pour
            afficher l&apos;amortissement.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Project;
