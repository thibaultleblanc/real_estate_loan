import { useState } from "react";
import { clampScenarioStep } from "../../constants/scenarioFlow";
import { DEFAULT_FACTORY_SETTINGS } from "../../utils/factorySettings";
import { useLoanScenario } from "./hooks/useLoanScenario";
import { useProjectScenario } from "./hooks/useProjectScenario";
import { useSalaryScenario } from "./hooks/useSalaryScenario";
import { useScenarioIO } from "./hooks/useScenarioIO";

export function useScenarioController() {
  const {
    scenario,
    setScenario,
    errorMessage,
    fileInputRef,
    resetScenarioData,
    handleExport,
    handleImportRequest,
    handleImportFile,
  } = useScenarioIO();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    salaryMetrics,
    isTaxSliderTouched,
    updateSalaryField,
    resetSalaryUiState,
  } = useSalaryScenario({ scenario, setScenario });

  const { loanMetrics, updateLoanField } = useLoanScenario({
    scenario,
    salaryMetrics,
    setScenario,
  });

  const { updateProjectField } = useProjectScenario({ setScenario });

  function setCurrentStep(nextStep) {
    setScenario((prev) => ({
      ...prev,
      currentStep: clampScenarioStep(nextStep),
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
    resetSalaryUiState();
    resetScenarioData();
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
    updateProjectField,
    updateSettingField,
    resetFactorySettings,
    toggleSettings,
    handleReset,
    handleExport,
    handleImportRequest,
    handleImportFile,
  };
}
