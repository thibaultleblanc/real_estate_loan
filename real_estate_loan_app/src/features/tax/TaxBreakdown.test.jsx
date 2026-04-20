import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TaxBreakdown from "./TaxBreakdown";
import { calculateTaxBreakdown } from "../../utils/calculations";
import { DEFAULT_FACTORY_SETTINGS } from "../../utils/factorySettings";

describe("TaxBreakdown", () => {
  it("permet d'ajuster le taux via le slider et afficher le detail", () => {
    const onTaxRateChange = vi.fn();
    const taxBreakdown = calculateTaxBreakdown(60000, DEFAULT_FACTORY_SETTINGS);

    render(
      <TaxBreakdown
        taxBreakdown={taxBreakdown}
        annualTax={6000}
        monthlyTax={500}
        nbMois={12}
        taxRate="10"
        isSliderTouched={false}
        onTaxRateChange={onTaxRateChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /voir le detail/i }));
    expect(
      screen.getByRole("button", { name: /masquer le detail/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Tranche (€)")).toBeInTheDocument();

    fireEvent.keyDown(
      screen.getByRole("slider", { name: /taux d'imposition/i }),
      {
        key: "ArrowRight",
      },
    );

    expect(onTaxRateChange).toHaveBeenCalled();
  });

  it("applique un style different quand le slider a ete touche", () => {
    const taxBreakdown = calculateTaxBreakdown(60000, DEFAULT_FACTORY_SETTINGS);

    const { rerender } = render(
      <TaxBreakdown
        taxBreakdown={taxBreakdown}
        annualTax={6000}
        monthlyTax={500}
        nbMois={12}
        taxRate="10"
        isSliderTouched={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /voir le detail/i }));
    const containerBefore = screen.getByRole("table").parentElement;
    const classBefore = containerBefore?.className;

    rerender(
      <TaxBreakdown
        taxBreakdown={taxBreakdown}
        annualTax={6000}
        monthlyTax={500}
        nbMois={12}
        taxRate="10"
        isSliderTouched
      />,
    );

    const containerAfter = screen.getByRole("table").parentElement;
    expect(containerAfter?.className).not.toBe(classBefore);
  });
});
