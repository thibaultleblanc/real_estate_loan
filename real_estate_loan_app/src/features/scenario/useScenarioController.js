import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateLoanMetrics,
  calculateSalaryMetrics,
  estimateTaxRateFromTaxableIncome,
} from "../../utils/calculations";
import { DEFAULT_FACTORY_SETTINGS } from "../../utils/factorySettings";
import {
  createDefaultScenario,
  exportScenarioToFile,
  importScenarioFromFile,
  loadScenarioFromStorage,
  resetScenarioStorage,
  saveScenarioToStorage,
} from "../../utils/scenarioStorage";

export function useScenarioController() {
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
  }, [salaryMetrics.baseImposableAnnuelle, scenario.settings]);

  function setCurrentStep(nextStep) {
    setScenario((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(2, nextStep)),
    }));
  }

  function updateSalaryField(field, value) {
    setIsTaxSliderTouched(field === "tauxImpot");
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

  function toggleSettings() {
    setIsSettingsOpen((prev) => !prev);
  }

  function handleReset() {
    setScenario(createDefaultScenario());
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

  return {
    scenario,
    errorMessage,
    isSettingsOpen,
    isTaxSliderTouched,
    fileInputRef,
    salaryMetrics,
    loanMetrics,
    setCurrentStep,
    updateSalaryField,
    updateLoanField,
    updateSettingField,
    resetFactorySettings,
    toggleSettings,
    handleReset,
    handleExport,
    handleImportRequest,
    handleImportFile,
  };
}
