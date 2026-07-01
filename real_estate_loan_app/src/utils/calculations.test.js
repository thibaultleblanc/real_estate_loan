import { describe, expect, it } from "vitest";
import {
  calculateLoanMetrics,
  calculateSalaryMetrics,
  calculateTaxBreakdown,
} from "./calculations";
import { DEFAULT_FACTORY_SETTINGS } from "./factorySettings";

describe("calculateSalaryMetrics", () => {
  it("calcule net, base imposable et net apres impot avec primes PEE/PERCO", () => {
    const salary = {
      brutAnnuel: "60000",
      isCadre: true,
      tauxImpot: "10",
      primes: "1000",
      primePartageValeur: "0",
      interessement: "0",
      participation: "0",
      abondement: "0",
      primesPeePerco: true,
      primePartageValeurPeePerco: false,
      interessementPeePerco: false,
      participationPeePerco: false,
      abondementPeePerco: false,
    };

    const metrics = calculateSalaryMetrics(salary, DEFAULT_FACTORY_SETTINGS);

    expect(metrics.annuelNet).toBe(45000);
    expect(metrics.avantagesNet).toBe(1000);
    expect(metrics.totalNetAnnuel).toBe(46000);
    expect(metrics.baseImposableAnnuelle).toBe(45000);
    expect(metrics.impotAnnuel).toBe(4500);
    expect(metrics.totalNetApresImpotAnnuel).toBe(41500);
  });
});

describe("calculateLoanMetrics", () => {
  it("calcule mensualite max et applique frais de notaire ancien", () => {
    const metrics = calculateLoanMetrics({
      netMensuel: 4000,
      loan: {
        duree: 20,
        tauxAnnuel: 3.5,
        tauxAssuranceAnnuel: 0,
        tauxFraisGarantie: 2,
        apport: "10000",
        isNeuf: false,
      },
      settings: DEFAULT_FACTORY_SETTINGS,
    });

    expect(metrics.nbMensualites).toBe(240);
    expect(metrics.mensualiteMax).toBe(1400);
    expect(metrics.totalRembourse).toBe(336000);
    expect(metrics.coutEmprunt).toBeCloseTo(
      metrics.totalRembourse - metrics.montantMax,
      2,
    );
    expect(metrics.totalAssurance).toBe(0);
    expect(metrics.totalInterets).toBeCloseTo(metrics.coutEmprunt, 2);
    expect(metrics.tauxFraisGarantie).toBe(2);
    expect(metrics.fraisGarantie).toBeCloseTo(metrics.montantMax * 0.02, 2);
    expect(metrics.tauxFraisNotaire).toBe(
      DEFAULT_FACTORY_SETTINGS.fraisNotaireAncien,
    );
    expect(metrics.fraisNotaire).toBeGreaterThan(0);
    expect(metrics.ltvCible).toBe(100);
  });

  it("bascule sur les frais notaire neuf quand isNeuf est vrai", () => {
    const metrics = calculateLoanMetrics({
      netMensuel: 4000,
      loan: {
        duree: 20,
        tauxAnnuel: 3.5,
        tauxAssuranceAnnuel: 0,
        tauxFraisGarantie: 2,
        apport: "10000",
        isNeuf: true,
      },
      settings: DEFAULT_FACTORY_SETTINGS,
    });

    expect(metrics.tauxFraisNotaire).toBe(
      DEFAULT_FACTORY_SETTINGS.fraisNotaireNeuf,
    );
  });

  it("reduit le montant empruntable quand le taux assurance augmente", () => {
    const withoutInsurance = calculateLoanMetrics({
      netMensuel: 4000,
      loan: {
        duree: 20,
        tauxAnnuel: 3.5,
        tauxAssuranceAnnuel: 0,
        tauxFraisGarantie: 2,
        apport: "10000",
        isNeuf: false,
      },
      settings: DEFAULT_FACTORY_SETTINGS,
    });

    const withInsurance = calculateLoanMetrics({
      netMensuel: 4000,
      loan: {
        duree: 20,
        tauxAnnuel: 3.5,
        tauxAssuranceAnnuel: 0.5,
        tauxFraisGarantie: 2,
        apport: "10000",
        isNeuf: false,
      },
      settings: DEFAULT_FACTORY_SETTINGS,
    });

    expect(withInsurance.montantMax).toBeLessThan(withoutInsurance.montantMax);
    expect(withInsurance.totalAssurance).toBeGreaterThan(0);
    expect(withInsurance.coutEmprunt).toBeCloseTo(
      withInsurance.totalInterets + withInsurance.totalAssurance,
      2,
    );
  });
});

describe("calculateTaxBreakdown", () => {
  it("retourne les montants taxes par tranche et le total", () => {
    const result = calculateTaxBreakdown(100000, DEFAULT_FACTORY_SETTINGS);

    expect(result.income).toBe(100000);
    expect(result.brackets).toHaveLength(
      DEFAULT_FACTORY_SETTINGS.taxBrackets.length,
    );
    expect(result.brackets[0].taxableAmount).toBe(11600);
    expect(result.brackets[1].taxableAmount).toBe(17979);
    expect(result.brackets[2].taxableAmount).toBe(54998);
    expect(result.brackets[3].taxableAmount).toBe(15423);
    expect(result.totalTax).toBeCloseTo(24800.52, 2);
  });

  it("gere la tranche infinie quand le revenu depasse tous les plafonds", () => {
    const result = calculateTaxBreakdown(300000, DEFAULT_FACTORY_SETTINGS);
    const lastBracket = result.brackets[result.brackets.length - 1];

    expect(lastBracket.label).toBe(">181917");
    expect(lastBracket.taxableAmount).toBeGreaterThan(0);
    expect(lastBracket.taxAmount).toBeGreaterThan(0);
  });
});
