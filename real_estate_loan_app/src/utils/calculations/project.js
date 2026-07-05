import { parseAmount } from "./shared";

export function calculateProjectMetrics(project = {}) {
  const valeurBien = Math.max(0, parseAmount(project.valeurBien));
  const surface = Math.max(0, parseAmount(project.surface));
  const hasParking = Boolean(project.hasParking);
  const valeurParking = hasParking
    ? Math.max(0, parseAmount(project.valeurParking))
    : 0;

  const coutHorsParking = hasParking
    ? Math.max(0, valeurBien - valeurParking)
    : valeurBien;

  const prixM2 = surface > 0 ? valeurBien / surface : 0;
  const prixM2HorsParking = surface > 0 ? coutHorsParking / surface : 0;

  return {
    valeurBien,
    surface,
    hasParking,
    valeurParking,
    coutHorsParking,
    prixM2,
    prixM2HorsParking,
  };
}
