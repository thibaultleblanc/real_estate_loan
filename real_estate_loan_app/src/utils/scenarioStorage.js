const STORAGE_KEY = "real_estate_loan_scenario_v1";
export const SCENARIO_VERSION = 1;

export const DEFAULT_SCENARIO = {
  version: SCENARIO_VERSION,
  currentStep: 0,
  salary: {
    brutAnnuel: "55000",
    isCadre: true,
    primes: "",
    intpart: "",
    abondement: "",
    isFiscalise: false,
  },
  loan: {
    duree: 20,
    tauxAnnuel: 3.5,
    apport: "0",
    isNeuf: false,
  },
};

function deepCloneDefaultScenario() {
  return JSON.parse(JSON.stringify(DEFAULT_SCENARIO));
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

function clampStep(step) {
  if (!Number.isInteger(step)) {
    return 0;
  }

  if (step < 0) {
    return 0;
  }

  if (step > 2) {
    return 2;
  }

  return step;
}

export function normalizeScenario(rawScenario) {
  const fallback = deepCloneDefaultScenario();
  if (!rawScenario || typeof rawScenario !== "object") {
    return fallback;
  }

  const salaryRaw =
    rawScenario.salary && typeof rawScenario.salary === "object"
      ? rawScenario.salary
      : {};
  const loanRaw =
    rawScenario.loan && typeof rawScenario.loan === "object"
      ? rawScenario.loan
      : {};

  return {
    version: SCENARIO_VERSION,
    currentStep: clampStep(rawScenario.currentStep),
    salary: {
      brutAnnuel: pickStringOrNumberAsString(
        salaryRaw.brutAnnuel,
        fallback.salary.brutAnnuel,
      ),
      isCadre: pickBoolean(salaryRaw.isCadre, fallback.salary.isCadre),
      primes: pickStringOrNumberAsString(
        salaryRaw.primes,
        fallback.salary.primes,
      ),
      intpart: pickStringOrNumberAsString(
        salaryRaw.intpart,
        fallback.salary.intpart,
      ),
      abondement: pickStringOrNumberAsString(
        salaryRaw.abondement,
        fallback.salary.abondement,
      ),
      isFiscalise: pickBoolean(
        salaryRaw.isFiscalise,
        fallback.salary.isFiscalise,
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
      apport: pickStringOrNumberAsString(loanRaw.apport, fallback.loan.apport),
      isNeuf: pickBoolean(loanRaw.isNeuf, fallback.loan.isNeuf),
    },
  };
}

export function createDefaultScenario() {
  return deepCloneDefaultScenario();
}

export function loadScenarioFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultScenario();
    }

    const parsed = JSON.parse(raw);
    return normalizeScenario(parsed);
  } catch {
    return createDefaultScenario();
  }
}

export function saveScenarioToStorage(scenario) {
  const safeScenario = normalizeScenario(scenario);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeScenario));
}

export function exportScenarioToFile(scenario) {
  const safeScenario = normalizeScenario(scenario);
  const payload = {
    ...safeScenario,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const datePrefix = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `scenario-${datePrefix}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importScenarioFromFile(file) {
  if (!file) {
    throw new Error("Aucun fichier selectionne.");
  }

  const content = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Le fichier JSON est invalide.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Le format du scenario est invalide.");
  }

  return normalizeScenario(parsed);
}

export function resetScenarioStorage() {
  window.localStorage.removeItem(STORAGE_KEY);
}
