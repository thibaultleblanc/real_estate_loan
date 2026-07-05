import { createDefaultScenario, SCENARIO_VERSION } from "./model";
import { clampScenarioStep } from "../../constants/scenarioFlow";

function normalizePercentValue(value, fallback) {
  const parsed = Math.max(0, pickNumber(value, fallback));
  return parsed <= 1 ? parsed * 100 : parsed;
}

function pickBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function pickNumber(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function pickStringOrNumberAsString(value, fallback) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

function pickBoundedNumber(value, fallback, min, max) {
  const parsed = pickNumber(value, fallback);
  return Math.min(max, Math.max(min, parsed));
}

function normalizeTaxBrackets(rawTaxBrackets, fallbackTaxBrackets) {
  if (
    !Array.isArray(rawTaxBrackets) ||
    rawTaxBrackets.length !== fallbackTaxBrackets.length
  ) {
    return fallbackTaxBrackets.map((bracket) => ({ ...bracket }));
  }

  let previousUpperBound = 0;

  return fallbackTaxBrackets.map((fallbackBracket, index) => {
    const rawBracket = rawTaxBrackets[index] || {};
    const isLast = index === fallbackTaxBrackets.length - 1;
    const rate = pickBoundedNumber(rawBracket.rate, fallbackBracket.rate, 0, 1);

    if (isLast) {
      return { upTo: null, rate };
    }

    const parsedUpperBound = pickNumber(rawBracket.upTo, fallbackBracket.upTo);
    const upTo = Math.max(previousUpperBound + 1, parsedUpperBound);
    previousUpperBound = upTo;

    return { upTo, rate };
  });
}

export function normalizeScenario(rawScenario) {
  const fallback = createDefaultScenario();

  if (!rawScenario || typeof rawScenario !== "object") {
    return fallback;
  }

  const salaryRaw =
    rawScenario.salary && typeof rawScenario.salary === "object"
      ? rawScenario.salary
      : {};
  const settingsRaw =
    rawScenario.settings && typeof rawScenario.settings === "object"
      ? rawScenario.settings
      : {};
  const loanRaw =
    rawScenario.loan && typeof rawScenario.loan === "object"
      ? rawScenario.loan
      : {};
  const projectRaw =
    rawScenario.project && typeof rawScenario.project === "object"
      ? rawScenario.project
      : {};

  return {
    version: SCENARIO_VERSION,
    currentStep: clampScenarioStep(rawScenario.currentStep),
    settings: {
      heuresMensuelles: pickBoundedNumber(
        settingsRaw.heuresMensuelles,
        fallback.settings.heuresMensuelles,
        1,
        300,
      ),
      nbMois: pickBoundedNumber(
        settingsRaw.nbMois,
        fallback.settings.nbMois,
        1,
        24,
      ),
      tauxCadre: pickBoundedNumber(
        settingsRaw.tauxCadre,
        fallback.settings.tauxCadre,
        0,
        1,
      ),
      tauxNonCadre: pickBoundedNumber(
        settingsRaw.tauxNonCadre,
        fallback.settings.tauxNonCadre,
        0,
        1,
      ),
      tauxEndettement: pickBoundedNumber(
        settingsRaw.tauxEndettement,
        fallback.settings.tauxEndettement,
        0,
        1,
      ),
      fraisGarantie: pickBoundedNumber(
        settingsRaw.fraisGarantie,
        fallback.settings.fraisGarantie,
        0,
        1,
      ),
      fraisNotaireNeuf: pickBoundedNumber(
        settingsRaw.fraisNotaireNeuf,
        fallback.settings.fraisNotaireNeuf,
        0,
        1,
      ),
      fraisNotaireAncien: pickBoundedNumber(
        settingsRaw.fraisNotaireAncien,
        fallback.settings.fraisNotaireAncien,
        0,
        1,
      ),
      taxBrackets: normalizeTaxBrackets(
        settingsRaw.taxBrackets,
        fallback.settings.taxBrackets,
      ),
    },
    salary: {
      brutAnnuel: pickStringOrNumberAsString(
        salaryRaw.brutAnnuel,
        fallback.salary.brutAnnuel,
      ),
      isCadre: pickBoolean(salaryRaw.isCadre, fallback.salary.isCadre),
      tauxImpot: pickStringOrNumberAsString(
        salaryRaw.tauxImpot,
        fallback.salary.tauxImpot,
      ),
      primes: pickStringOrNumberAsString(
        salaryRaw.primes,
        fallback.salary.primes,
      ),
      primePartageValeur: pickStringOrNumberAsString(
        salaryRaw.primePartageValeur,
        fallback.salary.primePartageValeur,
      ),
      interessement: pickStringOrNumberAsString(
        salaryRaw.interessement ?? salaryRaw.intpart,
        fallback.salary.interessement,
      ),
      participation: pickStringOrNumberAsString(
        salaryRaw.participation,
        fallback.salary.participation,
      ),
      abondement: pickStringOrNumberAsString(
        salaryRaw.abondement,
        fallback.salary.abondement,
      ),
      primesPeePerco: pickBoolean(
        salaryRaw.primesPeePerco,
        fallback.salary.primesPeePerco,
      ),
      primePartageValeurPeePerco: pickBoolean(
        salaryRaw.primePartageValeurPeePerco,
        fallback.salary.primePartageValeurPeePerco,
      ),
      interessementPeePerco: pickBoolean(
        salaryRaw.interessementPeePerco ?? salaryRaw.isFiscalise,
        fallback.salary.interessementPeePerco,
      ),
      participationPeePerco: pickBoolean(
        salaryRaw.participationPeePerco ?? salaryRaw.isFiscalise,
        fallback.salary.participationPeePerco,
      ),
      abondementPeePerco: pickBoolean(
        salaryRaw.abondementPeePerco,
        fallback.salary.abondementPeePerco,
      ),
      primesStable: pickBoolean(
        salaryRaw.primesStable,
        fallback.salary.primesStable,
      ),
      primePartageValeurStable: pickBoolean(
        salaryRaw.primePartageValeurStable,
        fallback.salary.primePartageValeurStable,
      ),
      interessementStable: pickBoolean(
        salaryRaw.interessementStable,
        fallback.salary.interessementStable,
      ),
      participationStable: pickBoolean(
        salaryRaw.participationStable,
        fallback.salary.participationStable,
      ),
      abondementStable: pickBoolean(
        salaryRaw.abondementStable,
        fallback.salary.abondementStable,
      ),
    },
    loan: {
      duree: Math.min(
        25,
        Math.max(
          10,
          Math.round(pickNumber(loanRaw.duree, fallback.loan.duree)),
        ),
      ),
      tauxAnnuel: Math.max(
        0,
        pickNumber(loanRaw.tauxAnnuel, fallback.loan.tauxAnnuel),
      ),
      tauxAssuranceAnnuel: Math.max(
        0,
        pickNumber(
          loanRaw.tauxAssuranceAnnuel,
          fallback.loan.tauxAssuranceAnnuel,
        ),
      ),
      tauxFraisGarantie: normalizePercentValue(
        loanRaw.tauxFraisGarantie,
        fallback.loan.tauxFraisGarantie ?? fallback.settings.fraisGarantie,
      ),
      loanToValue: pickBoundedNumber(
        loanRaw.loanToValue,
        fallback.loan.loanToValue,
        50,
        100,
      ),
      apport: pickStringOrNumberAsString(loanRaw.apport, fallback.loan.apport),
      isNeuf: pickBoolean(loanRaw.isNeuf, fallback.loan.isNeuf),
      revenuNetBancaire: pickStringOrNumberAsString(
        loanRaw.revenuNetBancaire,
        fallback.loan.revenuNetBancaire,
      ),
    },
    project: {
      valeurBien: pickStringOrNumberAsString(
        projectRaw.valeurBien,
        fallback.project.valeurBien,
      ),
      surface: pickStringOrNumberAsString(
        projectRaw.surface,
        fallback.project.surface,
      ),
      hasParking: pickBoolean(
        projectRaw.hasParking,
        fallback.project.hasParking,
      ),
      valeurParking: pickStringOrNumberAsString(
        projectRaw.valeurParking,
        fallback.project.valeurParking,
      ),
      revenuNetBancaire: pickStringOrNumberAsString(
        projectRaw.revenuNetBancaire,
        fallback.project.revenuNetBancaire,
      ),
      montantEmprunte: pickStringOrNumberAsString(
        projectRaw.montantEmprunte,
        fallback.project.montantEmprunte,
      ),
      dureePret: Math.min(
        40,
        Math.max(
          1,
          Math.round(
            pickNumber(projectRaw.dureePret, fallback.project.dureePret),
          ),
        ),
      ),
      tauxAnnuelPret: pickStringOrNumberAsString(
        projectRaw.tauxAnnuelPret,
        fallback.project.tauxAnnuelPret,
      ),
      tauxAssurancePret: pickStringOrNumberAsString(
        projectRaw.tauxAssurancePret,
        fallback.project.tauxAssurancePret,
      ),
    },
  };
}
