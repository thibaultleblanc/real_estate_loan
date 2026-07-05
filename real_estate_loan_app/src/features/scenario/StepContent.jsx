import Salary from "../salary/Salary";
import RealEstateLoan from "../loan/RealEstateLoan";
import Rentability from "../rentability/Rentability";
import Project from "../project/Project";
import { SCENARIO_STEP_INDEX } from "../../constants/scenarioFlow";

function StepContent({
  currentStep,
  scenario,
  salaryMetrics,
  loanMetrics,
  isTaxSliderTouched,
  onSalaryFieldChange,
  onLoanFieldChange,
  onProjectFieldChange,
}) {
  if (currentStep === SCENARIO_STEP_INDEX.REVENU) {
    return (
      <Salary
        salary={scenario.salary}
        settings={scenario.settings}
        metrics={salaryMetrics}
        isTaxSliderTouched={isTaxSliderTouched}
        onFieldChange={onSalaryFieldChange}
      />
    );
  }

  if (currentStep === SCENARIO_STEP_INDEX.CAPACITE) {
    return (
      <RealEstateLoan
        loan={scenario.loan}
        settings={scenario.settings}
        metrics={loanMetrics}
        salaryMetrics={salaryMetrics}
        onFieldChange={onLoanFieldChange}
      />
    );
  }

  if (currentStep === SCENARIO_STEP_INDEX.PROJET) {
    return (
      <Project
        project={scenario.project}
        settings={scenario.settings}
        salaryMetrics={salaryMetrics}
        onFieldChange={onProjectFieldChange}
      />
    );
  }

  return <Rentability />;
}

export default StepContent;
