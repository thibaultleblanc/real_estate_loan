import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import FactorySettingsDrawer from "./FactorySettingsDrawer";
import Header from "./Header";
import Salary from "./Salary";
import RealEstateLoan from "./RealEstateLoan";
import Rentability from "./Rentability";
import {
  calculateLoanMetrics,
  calculateSalaryMetrics,
  estimateTaxRateFromTaxableIncome,
} from "./utils/calculations";
import { DEFAULT_FACTORY_SETTINGS } from "./utils/factorySettings";
import {
  createDefaultScenario,
  exportScenarioToFile,
  importScenarioFromFile,
  loadScenarioFromStorage,
  resetScenarioStorage,
  saveScenarioToStorage,
} from "./utils/scenarioStorage";

function MainView() {
  const [scenario, setScenario] = useState(() => loadScenarioFromStorage());
  const [errorMessage, setErrorMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTaxSliderTouched, setIsTaxSliderTouched] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    saveScenarioToStorage(scenario);
  }, [scenario]);

  const salaryMetrics = useMemo(
    () => calculateSalaryMetrics(scenario.salary, scenario.settings),
    [scenario.salary, scenario.settings],
  );
  const loanMetrics = useMemo(
    () =>
      calculateLoanMetrics({
        netMensuel: salaryMetrics.totalNetMensuel,
        loan: scenario.loan,
        settings: scenario.settings,
      }),
    [salaryMetrics.totalNetMensuel, scenario.loan, scenario.settings],
  );

  useEffect(() => {
    const suggestedTaxRate = estimateTaxRateFromTaxableIncome(
      salaryMetrics.baseImposableAnnuelle,
      scenario.settings,
    );

    setScenario((prev) => {
      const prevTaxRate = Number.parseFloat(prev.salary.tauxImpot);
      if (
        Number.isFinite(prevTaxRate) &&
        Math.abs(prevTaxRate - suggestedTaxRate) < 0.05
      ) {
        return prev;
      }

      return {
        ...prev,
        salary: {
          ...prev.salary,
          tauxImpot: String(suggestedTaxRate),
        },
      };
    });
  }, [salaryMetrics.baseImposableAnnuelle]);

  function setCurrentStep(nextStep) {
    setScenario((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(2, nextStep)),
    }));
  }

  function updateSalaryField(field, value) {
    if (field === "tauxImpot") {
      setIsTaxSliderTouched(true);
    } else {
      setIsTaxSliderTouched(false);
    }

    setScenario((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  }

  function updateLoanField(field, value) {
    setScenario((prev) => ({
      ...prev,
      loan: {
        ...prev.loan,
        [field]: value,
      },
    }));
  }

  function updateSettingField(field, value) {
    setScenario((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  }

  function resetFactorySettings() {
    setScenario((prev) => ({
      ...prev,
      settings: {
        ...DEFAULT_FACTORY_SETTINGS,
        taxBrackets: DEFAULT_FACTORY_SETTINGS.taxBrackets.map((bracket) => ({
          ...bracket,
        })),
      },
    }));
  }

  function handleReset() {
    const defaultScenario = createDefaultScenario();
    setScenario(defaultScenario);
    setIsTaxSliderTouched(false);
    resetScenarioStorage();
    setErrorMessage("");
  }

  function handleExport() {
    exportScenarioToFile(scenario);
    setErrorMessage("");
  }

  function handleImportRequest() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const importedScenario = await importScenarioFromFile(file);
      setScenario(importedScenario);
      setIsTaxSliderTouched(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Echec de l'import du scenario.");
    } finally {
      event.target.value = "";
    }
  }

  function renderCurrentStep() {
    if (scenario.currentStep === 0) {
      return (
        <Salary
          salary={scenario.salary}
          settings={scenario.settings}
          metrics={salaryMetrics}
          isTaxSliderTouched={isTaxSliderTouched}
          onFieldChange={updateSalaryField}
        />
      );
    }

    if (scenario.currentStep === 1) {
      return (
        <RealEstateLoan
          loan={scenario.loan}
          settings={scenario.settings}
          metrics={loanMetrics}
          onFieldChange={updateLoanField}
        />
      );
    }

    return <Rentability />;
  }

  return (
    <Box
      className="main-view"
      sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <Header
        currentStep={scenario.currentStep}
        onStepChange={setCurrentStep}
      />
      <FactorySettingsDrawer
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen((prev) => !prev)}
        settings={scenario.settings}
        onSettingChange={updateSettingField}
        onReset={resetFactorySettings}
      />
      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 4 },
          pb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{
            p: { xs: 1.6, md: 2 },
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(6px)",
            mb: 2,
          }}
        >
          <Typography sx={{ color: "#4F46E5", fontWeight: 700 }}>
            Scenario en cours: etape {scenario.currentStep + 1} / 3
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" color="primary" onClick={handleExport}>
              Exporter JSON
            </Button>
            <Button variant="outlined" onClick={handleImportRequest}>
              Importer JSON
            </Button>
            <Button variant="text" color="inherit" onClick={handleReset}>
              Reinitialiser
            </Button>
          </Stack>
          <input
            type="file"
            accept="application/json,.json"
            ref={fileInputRef}
            onChange={handleImportFile}
            style={{ display: "none" }}
          />
        </Stack>

        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Box
          sx={{
            borderRadius: 3,
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 2 },
            background: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
          }}
        >
          {renderCurrentStep()}
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            disabled={scenario.currentStep === 0}
            onClick={() => setCurrentStep(scenario.currentStep - 1)}
          >
            Precedent
          </Button>
          <Button
            variant="contained"
            disabled={scenario.currentStep === 2}
            onClick={() => setCurrentStep(scenario.currentStep + 1)}
          >
            Suivant
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default MainView;
