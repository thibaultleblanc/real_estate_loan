export const SCENARIO_STEPS = [
  { key: "revenu", label: "Revenu" },
  { key: "capacite", label: "Capacité" },
  { key: "projet", label: "Projet" },
  { key: "rentabilite", label: "Rentabilité" },
];

export const SCENARIO_STEP_INDEX = {
  REVENU: 0,
  CAPACITE: 1,
  PROJET: 2,
  RENTABILITE: 3,
};

export const SCENARIO_FIRST_STEP_INDEX = 0;
export const SCENARIO_STEP_COUNT = SCENARIO_STEPS.length;
export const SCENARIO_LAST_STEP_INDEX = SCENARIO_STEP_COUNT - 1;

export const SCENARIO_TITLE = "Revenu, Capacite, Projet, Rentabilité";

export function clampScenarioStep(step) {
  if (!Number.isInteger(step)) {
    return SCENARIO_FIRST_STEP_INDEX;
  }

  return Math.max(
    SCENARIO_FIRST_STEP_INDEX,
    Math.min(SCENARIO_LAST_STEP_INDEX, step),
  );
}
