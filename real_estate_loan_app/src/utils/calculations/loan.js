import { DEFAULT_FACTORY_SETTINGS } from "../factorySettings";
import { parseAmount } from "./shared";

export function getMontantMax(mensualite, duree, tauxAnnuel) {
  const n = duree * 12;
  const tauxMensuel = tauxAnnuel / 12 / 100;

  if (tauxMensuel === 0) {
    return mensualite * n;
  }

  return (mensualite * (1 - Math.pow(1 + tauxMensuel, -n))) / tauxMensuel;
}

export function calculateLoanMetrics({
  netMensuel,
  loan,
  settings = DEFAULT_FACTORY_SETTINGS,
}) {
  const nbMensualites = loan.duree * 12;
  const mensualiteMax = netMensuel * settings.tauxEndettement;
  const montantMax = getMontantMax(mensualiteMax, loan.duree, loan.tauxAnnuel);
  const totalRembourse = mensualiteMax * nbMensualites;
  const coutEmprunt = totalRembourse - montantMax;
  const apportValue = parseAmount(loan.apport);
  const capaciteAchatBrut = montantMax + apportValue;
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
    apportValue,
    tauxFraisNotaire,
    tauxEndettement: settings.tauxEndettement,
    fraisNotaire,
    capaciteAchatNet: capaciteAchatBrut - fraisNotaire,
  };
}
