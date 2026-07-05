import { useEffect, useMemo, useState } from "react";
import {
  calculateSalaryMetrics,
  estimateTaxRateFromTaxableIncome,
} from "../../../utils/calculations";

export function useSalaryScenario({ scenario, setScenario }) {
  const [isTaxSliderTouched, setIsTaxSliderTouched] = useState(false);

  const salaryMetrics = useMemo(
    () => calculateSalaryMetrics(scenario.salary, scenario.settings),
    [scenario.salary, scenario.settings],
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
  }, [salaryMetrics.baseImposableAnnuelle, scenario.settings, setScenario]);

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

  function resetSalaryUiState() {
    setIsTaxSliderTouched(false);
  }

  return {
    salaryMetrics,
    isTaxSliderTouched,
    updateSalaryField,
    resetSalaryUiState,
  };
}
