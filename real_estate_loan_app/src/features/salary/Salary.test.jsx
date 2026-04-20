import { fireEvent, render, screen } from "@testing-library/react";
import { useMemo, useState } from "react";
import { describe, expect, it } from "vitest";
import Salary from "./Salary";
import { calculateSalaryMetrics } from "../../utils/calculations";
import { DEFAULT_FACTORY_SETTINGS } from "../../utils/factorySettings";

function SalaryHarness() {
  const [salary, setSalary] = useState({
    brutAnnuel: "60000",
    isCadre: true,
    tauxImpot: "0",
    primes: "",
    primePartageValeur: "",
    interessement: "",
    participation: "",
    abondement: "",
    primesPegPerco: false,
    primePartageValeurPegPerco: false,
    interessementPegPerco: false,
    participationPegPerco: false,
    abondementPegPerco: false,
  });

  const metrics = useMemo(
    () => calculateSalaryMetrics(salary, DEFAULT_FACTORY_SETTINGS),
    [salary],
  );

  return (
    <Salary
      salary={salary}
      metrics={metrics}
      isTaxSliderTouched={false}
      onFieldChange={(field, value) =>
        setSalary((prev) => ({
          ...prev,
          [field]: value,
        }))
      }
    />
  );
}

describe("Salary", () => {
  it("recalcule les metriques quand le brut annuel change", () => {
    render(<SalaryHarness />);

    expect(screen.getAllByText("45000.00").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByDisplayValue("60000"), {
      target: { value: "120000" },
    });

    expect(screen.getAllByText("90000.00").length).toBeGreaterThan(0);
  });
});
