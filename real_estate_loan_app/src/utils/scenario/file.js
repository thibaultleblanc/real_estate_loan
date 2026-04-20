import { normalizeScenario } from "./normalizer";

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
