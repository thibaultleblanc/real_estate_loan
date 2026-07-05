import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ScenarioView from "./ScenarioView";
import { STORAGE_KEY } from "../../utils/scenario/model";

vi.mock("../loan/RealEstateLoan", () => ({
  default: () => <div>Etape Capacite</div>,
}));

vi.mock("../salary/Salary", () => ({
  default: () => <div>Etape Revenu</div>,
}));

vi.mock("../project/Project", () => ({
  default: () => <div>Etape Projet</div>,
}));

vi.mock("../rentability/Rentability", () => ({
  default: () => <div>Etape Rentabilite</div>,
}));

describe("ScenarioView integration", () => {
  it("gere la navigation sur 4 etapes et persiste currentStep", async () => {
    render(<ScenarioView />);

    const nextButton = screen.getByRole("button", { name: "Suivant" });
    const previousButton = screen.getByRole("button", { name: "Precedent" });

    expect(previousButton).toBeDisabled();
    expect(screen.getByText(/etape 1/i)).toBeInTheDocument();

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
    expect(screen.getByText(/etape 4/i)).toBeInTheDocument();

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      expect(stored.currentStep).toBe(3);
    });
  });

  it("supporte export et import puis met a jour l'etape", async () => {
    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:scenario");
    const revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const { container } = render(<ScenarioView />);

    fireEvent.click(screen.getByRole("button", { name: "Exporter JSON" }));

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:scenario");

    const input = container.querySelector("input[type='file']");
    const file = new File(
      [JSON.stringify({ currentStep: 2 })],
      "scenario.json",
      {
        type: "application/json",
      },
    );

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/etape 3/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      expect(stored.currentStep).toBe(2);
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
