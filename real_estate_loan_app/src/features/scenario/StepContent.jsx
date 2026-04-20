import Salary from "../salary/Salary";
import RealEstateLoan from "../loan/RealEstateLoan";
import Rentability from "../rentability/Rentability";

function StepContent({
  currentStep,
  scenario,
  salaryMetrics,
  loanMetrics,
  isTaxSliderTouched,
  onSalaryFieldChange,
  onLoanFieldChange,
}) {
  if (currentStep === 0) {
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

  if (currentStep === 1) {
    return (
      <RealEstateLoan
        loan={scenario.loan}
        settings={scenario.settings}
        metrics={loanMetrics}
        onFieldChange={onLoanFieldChange}
      />
    );
  }

  return <Rentability />;
}

export default StepContent;
