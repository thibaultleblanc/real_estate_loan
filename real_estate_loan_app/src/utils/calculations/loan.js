import { DEFAULT_FACTORY_SETTINGS } from "../factorySettings";
import { parseAmount } from "./shared";

export function getMontantMax(
  mensualite,
  duree,
  tauxAnnuel,
  tauxAssuranceAnnuel = 0,
) {
  const n = duree * 12;
  const tauxMensuel = tauxAnnuel / 12 / 100;
  const tauxAssuranceMensuel = Math.max(0, tauxAssuranceAnnuel) / 12 / 100;

  if (n <= 0) {
    return 0;
  }

  const facteurAmortissement =
    tauxMensuel === 0
      ? 1 / n
      : tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -n));
  const tauxMensuelTotal = facteurAmortissement + tauxAssuranceMensuel;

  if (tauxMensuelTotal === 0) {
    return mensualite * n;
  }

  return mensualite / tauxMensuelTotal;
}

export function calculateLoanMetrics({
  netMensuel,
  loan,
  settings = DEFAULT_FACTORY_SETTINGS,
}) {
  const nbMensualites = loan.duree * 12;
  const mensualiteMax = netMensuel * settings.tauxEndettement;
  const tauxAssuranceAnnuel = Math.max(
    0,
    Number.parseFloat(loan.tauxAssuranceAnnuel ?? 0) || 0,
  );
  const montantMax = getMontantMax(
    mensualiteMax,
    loan.duree,
    loan.tauxAnnuel,
    tauxAssuranceAnnuel,
  );
  const assuranceMensuelle = (montantMax * (tauxAssuranceAnnuel / 100)) / 12;
  const totalAssurance = assuranceMensuelle * nbMensualites;
  const totalRembourse = mensualiteMax * nbMensualites;
  const coutEmprunt = totalRembourse - montantMax;
  const totalInterets = Math.max(0, coutEmprunt - totalAssurance);
  const apportValue = parseAmount(loan.apport);
  const capaciteAchatBrut = montantMax + apportValue;
  const rawTauxFraisGarantie = Math.max(
    0,
    Number.parseFloat(loan.tauxFraisGarantie ?? settings.fraisGarantie ?? 0) ||
      0,
  );
  const tauxFraisGarantie =
    rawTauxFraisGarantie <= 1
      ? rawTauxFraisGarantie * 100
      : rawTauxFraisGarantie;
  const fraisGarantie = montantMax * (tauxFraisGarantie / 100);
  const tauxFraisNotaire = loan.isNeuf
    ? settings.fraisNotaireNeuf
    : settings.fraisNotaireAncien;
  const fraisNotaire = capaciteAchatBrut * tauxFraisNotaire;

  return {
    nbMensualites,
    mensualiteMax,
    montantMax,
    totalRembourse,
    coutEmprunt,
    totalInterets,
    tauxAssuranceAnnuel,
    assuranceMensuelle,
    totalAssurance,
    apportValue,
    tauxFraisGarantie,
    fraisGarantie,
    tauxFraisNotaire,
    tauxEndettement: settings.tauxEndettement,
    fraisNotaire,
    capaciteAchatNet: capaciteAchatBrut - fraisNotaire - fraisGarantie,
  };
}
