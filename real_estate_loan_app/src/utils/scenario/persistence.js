import { STORAGE_KEY, createDefaultScenario } from "./model";
import { normalizeScenario } from "./normalizer";

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

export function resetScenarioStorage() {
  window.localStorage.removeItem(STORAGE_KEY);
}
