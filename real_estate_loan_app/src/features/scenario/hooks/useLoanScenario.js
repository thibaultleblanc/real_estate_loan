import { useMemo } from "react";
import { parseAmount } from "../../../utils/calculations/shared";
import { calculateLoanMetrics } from "../../../utils/calculations";

export function useLoanScenario({ scenario, salaryMetrics, setScenario }) {
  const loanMetrics = useMemo(() => {
    const netMensuel =
      parseAmount(scenario.loan.revenuNetBancaire) ||
      salaryMetrics.stableNetMensuel;

    return calculateLoanMetrics({
      netMensuel,
      loan: scenario.loan,
      settings: scenario.settings,
    });
  }, [salaryMetrics.stableNetMensuel, scenario.loan, scenario.settings]);

  function updateLoanField(field, value) {
    setScenario((prev) => ({
      ...prev,
      loan: {
        ...prev.loan,
        [field]: value,
      },
    }));
  }

  return {
    loanMetrics,
    updateLoanField,
  };
}
