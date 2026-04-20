import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SCENARIO,
  createDefaultScenario,
  exportScenarioToFile,
  importScenarioFromFile,
  loadScenarioFromStorage,
  normalizeScenario,
  resetScenarioStorage,
  saveScenarioToStorage,
} from "./scenarioStorage";

describe("normalizeScenario", () => {
  it("normalise un import partiel et applique les bornes", () => {
    const normalized = normalizeScenario({
      currentStep: 9,
      settings: {
        nbMois: 30,
        tauxCadre: 2,
        taxBrackets: [{ upTo: 10, rate: 0.9 }],
      },
      salary: {
        brutAnnuel: 70000,
        intpart: "2500",
        isFiscalise: true,
      },
      loan: {
        duree: 8,
        tauxAnnuel: "4.2",
      },
    });

    expect(normalized.currentStep).toBe(2);
    expect(normalized.settings.nbMois).toBe(24);
    expect(normalized.settings.tauxCadre).toBe(1);
    expect(normalized.settings.taxBrackets).toHaveLength(
      DEFAULT_SCENARIO.settings.taxBrackets.length,
    );
    expect(normalized.salary.brutAnnuel).toBe("70000");
    expect(normalized.salary.interessement).toBe("2500");
    expect(normalized.salary.interessementPegPerco).toBe(true);
    expect(normalized.salary.participationPegPerco).toBe(true);
    expect(normalized.loan.duree).toBe(10);
    expect(normalized.loan.tauxAnnuel).toBe(4.2);
  });

  it("retourne le fallback complet sur input invalide", () => {
    const normalized = normalizeScenario(null);

    expect(normalized).toEqual(DEFAULT_SCENARIO);
    expect(normalized).not.toBe(DEFAULT_SCENARIO);
  });
});

describe("storage", () => {
  it("sauvegarde et recharge un scenario normalise", () => {
    saveScenarioToStorage({
      ...createDefaultScenario(),
      currentStep: -5,
      loan: { duree: 17, tauxAnnuel: 3.1, apport: "5000", isNeuf: true },
    });

    const loaded = loadScenarioFromStorage();

    expect(loaded.currentStep).toBe(0);
    expect(loaded.loan.duree).toBe(17);
    expect(loaded.loan.isNeuf).toBe(true);
  });

  it("supprime les donnees sauvegardees", () => {
    saveScenarioToStorage(createDefaultScenario());
    resetScenarioStorage();

    const loaded = loadScenarioFromStorage();

    expect(loaded).toEqual(DEFAULT_SCENARIO);
  });
});

describe("import/export", () => {
  it("exporte un scenario en declenchant le telechargement", () => {
    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:scenario");
    const revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    exportScenarioToFile(createDefaultScenario());

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:scenario");

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it("importe un JSON valide et rejette un JSON invalide", async () => {
    const validFile = new File(
      [JSON.stringify({ salary: { brutAnnuel: 123456 } })],
      "scenario.json",
      { type: "application/json" },
    );

    const imported = await importScenarioFromFile(validFile);
    expect(imported.salary.brutAnnuel).toBe("123456");

    const invalidFile = new File(["{invalid json"], "bad.json", {
      type: "application/json",
    });

    await expect(importScenarioFromFile(invalidFile)).rejects.toThrow(
      "Le fichier JSON est invalide.",
    );
  });
});
