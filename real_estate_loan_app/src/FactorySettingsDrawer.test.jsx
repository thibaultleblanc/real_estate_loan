import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FactorySettingsDrawer from "./FactorySettingsDrawer";
import { DEFAULT_FACTORY_SETTINGS } from "./utils/factorySettings";

describe("FactorySettingsDrawer", () => {
  it("edite les parametres d'impots et propage la mise a jour", () => {
    const onSettingChange = vi.fn();
    const onReset = vi.fn();
    const onClose = vi.fn();

    render(
      <FactorySettingsDrawer
        open
        onClose={onClose}
        settings={DEFAULT_FACTORY_SETTINGS}
        onSettingChange={onSettingChange}
        onReset={onReset}
      />,
    );

    const taxRateInputs = screen.getAllByLabelText(/taux \(%\)/i);
    fireEvent.change(taxRateInputs[0], { target: { value: "12.5" } });

    expect(onSettingChange).toHaveBeenCalled();
    const [field, value] = onSettingChange.mock.calls.at(-1);
    expect(field).toBe("taxBrackets");
    expect(value[0].rate).toBeCloseTo(0.125, 3);
  });

  it("permet de reduire et de deplier toutes les sections", () => {
    render(
      <FactorySettingsDrawer
        open
        onClose={vi.fn()}
        settings={DEFAULT_FACTORY_SETTINGS}
        onSettingChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    const toggleAll = screen.getByText(/tout reduire/i);
    fireEvent.click(toggleAll);
    expect(screen.getByText(/tout deplier/i)).toBeInTheDocument();
  });
});
