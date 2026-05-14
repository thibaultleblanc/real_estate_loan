import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Drawer,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BRAND_COLORS } from "../../themeTokens";

const SETTINGS_SECTIONS = [
  {
    title: "Salaire",
    fields: [
      {
        key: "heuresMensuelles",
        label: "Heures mensuelles",
        min: 1,
        max: 300,
        step: 0.01,
      },
      {
        key: "nbMois",
        label: "Nombre de mois",
        min: 1,
        max: 24,
        step: 1,
      },
      {
        key: "tauxCadre",
        label: "Taux net cadre",
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        key: "tauxNonCadre",
        label: "Taux net non cadre",
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    title: "Impots",
    fields: [],
  },
  {
    title: "Emprunt",
    fields: [
      {
        key: "tauxEndettement",
        label: "Taux d'endettement",
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    title: "Frais de notaire",
    fields: [
      {
        key: "fraisNotaireNeuf",
        label: "Frais de notaire neuf",
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        key: "fraisNotaireAncien",
        label: "Frais de notaire ancien",
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
];

const ALL_SECTION_TITLES = SETTINGS_SECTIONS.map((section) => section.title);

function FactorySettingsDrawer({
  open,
  onClose,
  settings,
  onSettingChange,
  onReset,
}) {
  const drawerWidth = 380;
  const [expandedSections, setExpandedSections] = useState(ALL_SECTION_TITLES);

  const isAllExpanded = expandedSections.length === SETTINGS_SECTIONS.length;

  function handleNumberChange(field, value) {
    const parsed = Number.parseFloat(value);
    onSettingChange(field, Number.isFinite(parsed) ? parsed : 0);
  }

  function handleTaxBracketChange(index, key, value) {
    const nextTaxBrackets = (settings.taxBrackets || []).map((bracket) => ({
      ...bracket,
    }));
    if (!nextTaxBrackets[index]) {
      return;
    }

    const parsed = Number.parseFloat(value);
    if (key === "rate") {
      const ratePercent = Number.isFinite(parsed) ? parsed : 0;
      nextTaxBrackets[index].rate = Math.max(0, Math.min(1, ratePercent / 100));
    } else {
      const newUpperBound = Number.isFinite(parsed)
        ? Math.max(1, Math.round(parsed))
        : 1;
      nextTaxBrackets[index].upTo = newUpperBound;

      // Keep successive thresholds strictly increasing.
      for (let i = index + 1; i < nextTaxBrackets.length - 1; i += 1) {
        const previousUpTo = Number(nextTaxBrackets[i - 1].upTo) || 0;
        const currentUpTo = Number(nextTaxBrackets[i].upTo) || previousUpTo + 1;
        nextTaxBrackets[i].upTo = Math.max(
          previousUpTo + 1,
          Math.round(currentUpTo),
        );
      }
    }

    onSettingChange("taxBrackets", nextTaxBrackets);
  }

  function toggleAllSections() {
    setExpandedSections(isAllExpanded ? [] : ALL_SECTION_TITLES);
  }

  function handleSectionToggle(sectionTitle, isExpanded) {
    setExpandedSections((current) => {
      if (isExpanded) {
        return current.includes(sectionTitle)
          ? current
          : [...current, sectionTitle];
      }

      return current.filter((title) => title !== sectionTitle);
    });
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          position: "fixed",
          left: open ? { xs: 336, md: drawerWidth + 16 } : 16,
          top: "50%",
          transform: "translateY(-50%)",
          transition: "left 220ms ease",
          zIndex: 1300,
          minWidth: 0,
          width: 51,
          height: 51,
          p: 0,
          borderRadius: 999,
          boxShadow: "0 10px 25px rgba(79, 70, 229, 0.28)",
          fontSize: "2.4rem",
          lineHeight: 1,
        }}
        aria-label={open ? "Fermer les reglages" : "Ouvrir les reglages"}
      >
        ⚙
      </Button>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box
          sx={{
            width: { xs: 320, md: 380 },
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "#fcfbff",
            minHeight: "100%",
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.5 }}>
              Parametres usine
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Reglages live
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              Ces valeurs pilotent les calculs du site en direct et sont
              sauvegardees dans le scenario.
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Typography
              variant="body2"
              onClick={toggleAllSections}
              sx={{
                color: BRAND_COLORS.primary,
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-end",
                userSelect: "none",
              }}
            >
              {isAllExpanded ? "Tout reduire" : "Tout deplier"}
            </Typography>
            {SETTINGS_SECTIONS.map((section) => (
              <Accordion
                key={section.title}
                expanded={expandedSections.includes(section.title)}
                onChange={(_, isExpanded) =>
                  handleSectionToggle(section.title, isExpanded)
                }
                disableGutters
                elevation={0}
                sx={{
                  border: `1px solid ${BRAND_COLORS.divider}`,
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Typography
                      sx={{ color: BRAND_COLORS.primary, fontWeight: 700 }}
                    >
                      v
                    </Typography>
                  }
                  sx={{ px: 1.5, py: 0.25 }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: BRAND_COLORS.primary }}
                  >
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
                  {section.title === "Impots" ? (
                    <Stack spacing={1.25}>
                      {(settings.taxBrackets || []).map((bracket, index) => {
                        const isLast =
                          index === (settings.taxBrackets || []).length - 1;
                        const lowerBound =
                          index === 0
                            ? 0
                            : Number(
                                settings.taxBrackets[index - 1]?.upTo || 0,
                              ) + 1;
                        return (
                          <Box
                            key={`tax-bracket-${index}`}
                            sx={{
                              p: 1,
                              border: `1px solid ${BRAND_COLORS.divider}`,
                              borderRadius: 1.5,
                              bgcolor: "#fafafa",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {isLast
                                ? `Tranche ${index + 1} (a partir de ${lowerBound} €)`
                                : `Tranche ${index + 1} (${lowerBound} € a ${bracket.upTo} €)`}
                            </Typography>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={1}
                              sx={{ mt: 0.6 }}
                            >
                              <TextField
                                label={isLast ? "Plafond" : "Plafond (€)"}
                                type="number"
                                value={isLast ? "" : bracket.upTo}
                                onChange={(event) =>
                                  handleTaxBracketChange(
                                    index,
                                    "upTo",
                                    event.target.value,
                                  )
                                }
                                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                                size="small"
                                fullWidth
                                disabled={isLast}
                                helperText={
                                  isLast
                                    ? "Derniere tranche: sans plafond"
                                    : undefined
                                }
                              />
                              <TextField
                                label="Taux (%)"
                                type="number"
                                value={(Number(bracket.rate) * 100).toFixed(2)}
                                onChange={(event) =>
                                  handleTaxBracketChange(
                                    index,
                                    "rate",
                                    event.target.value,
                                  )
                                }
                                slotProps={{
                                  htmlInput: { min: 0, max: 100, step: 0.1 },
                                }}
                                size="small"
                                fullWidth
                              />
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Stack spacing={1.25}>
                      {section.fields.map((field) => (
                        <TextField
                          key={field.key}
                          label={field.label}
                          type="number"
                          value={settings[field.key]}
                          onChange={(event) =>
                            handleNumberChange(field.key, event.target.value)
                          }
                          slotProps={{
                            htmlInput: {
                              min: field.min,
                              max: field.max,
                              step: field.step,
                            },
                          }}
                          size="small"
                          fullWidth
                        />
                      ))}
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          <Button variant="outlined" onClick={onReset}>
            Reinitialiser les reglages usine
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default FactorySettingsDrawer;
