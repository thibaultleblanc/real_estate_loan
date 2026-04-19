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
                color: "#4F46E5",
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
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Typography sx={{ color: "#4F46E5", fontWeight: 700 }}>
                      v
                    </Typography>
                  }
                  sx={{ px: 1.5, py: 0.25 }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "#4F46E5" }}
                  >
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
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
                        inputProps={{
                          min: field.min,
                          max: field.max,
                          step: field.step,
                        }}
                        size="small"
                        fullWidth
                      />
                    ))}
                  </Stack>
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
