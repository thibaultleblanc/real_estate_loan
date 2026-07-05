import { describe, expect, it } from "vitest";
import { calculateProjectMetrics } from "../../utils/calculations";

describe("calculateProjectMetrics", () => {
  it("calcule le prix au m² standard sans parking", () => {
    const metrics = calculateProjectMetrics({
      valeurBien: "200000",
      surface: "50",
      hasParking: false,
      valeurParking: "15000",
    });

    expect(metrics.hasParking).toBe(false);
    expect(metrics.prixM2).toBe(4000);
    expect(metrics.prixM2HorsParking).toBe(4000);
  });

  it("calcule le prix au m² hors parking quand parking actif", () => {
    const metrics = calculateProjectMetrics({
      valeurBien: "215000",
      surface: "50",
      hasParking: true,
      valeurParking: "15000",
    });

    expect(metrics.hasParking).toBe(true);
    expect(metrics.coutHorsParking).toBe(200000);
    expect(metrics.prixM2).toBe(4300);
    expect(metrics.prixM2HorsParking).toBe(4000);
  });

  it("applique les gardes-fous sur les valeurs invalides", () => {
    const metrics = calculateProjectMetrics({
      valeurBien: "abc",
      surface: "0",
      hasParking: true,
      valeurParking: "999999",
    });

    expect(metrics.valeurBien).toBe(0);
    expect(metrics.coutHorsParking).toBe(0);
    expect(metrics.prixM2).toBe(0);
    expect(metrics.prixM2HorsParking).toBe(0);
  });
});
