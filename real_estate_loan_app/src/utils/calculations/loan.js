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
  const tauxAnnuel = Math.max(
    0,
    Number.parseFloat(String(loan.tauxAnnuel ?? 0).replace(",", ".")) || 0,
  );
  const tauxAssuranceAnnuel = Math.max(
    0,
    Number.parseFloat(
      String(loan.tauxAssuranceAnnuel ?? 0).replace(",", "."),
    ) || 0,
  );
  const rawTauxFraisGarantie = Math.max(
    0,
    Number.parseFloat(
      String(loan.tauxFraisGarantie ?? settings.fraisGarantie ?? 0).replace(
        ",",
        ".",
      ),
    ) || 0,
  );

  const nbMensualites = loan.duree * 12;
  const mensualiteMax = netMensuel * settings.tauxEndettement;

  const montantMax = getMontantMax(
    mensualiteMax,
    loan.duree,
    tauxAnnuel,
    tauxAssuranceAnnuel,
  );
  const assuranceMensuelle = (montantMax * (tauxAssuranceAnnuel / 100)) / 12;
  const totalAssurance = assuranceMensuelle * nbMensualites;
  const totalRembourse = mensualiteMax * nbMensualites;
  const coutEmprunt = totalRembourse - montantMax;
  const totalInterets = Math.max(0, coutEmprunt - totalAssurance);
  const apportValue = parseAmount(loan.apport);

  const tauxFraisGarantie =
    rawTauxFraisGarantie <= 1
      ? rawTauxFraisGarantie * 100
      : rawTauxFraisGarantie;
  const tauxFraisGarantieRatio = tauxFraisGarantie / 100;
  const tauxFraisNotaire = loan.isNeuf
    ? settings.fraisNotaireNeuf
    : settings.fraisNotaireAncien;

  const ltvCible = Math.min(1, Math.max(0.01, (loan.loanToValue ?? 100) / 100));

  const fraisGarantie = montantMax * tauxFraisGarantieRatio;
  const fraisNotaire = montantMax * tauxFraisNotaire;
  const fraisTotaux = fraisGarantie + fraisNotaire;

  // apportAttendu basé sur LTV cible (indépendant de l'apport réel fourni)
  const apportAttendu =
    (1 - ltvCible) * montantMax + fraisGarantie + fraisNotaire;

  // LTV effectif basé sur l'apport réel fourni
  const capaciteAchatNet = montantMax + apportValue - fraisTotaux;
  const ltvEffectif = (montantMax + fraisTotaux - apportValue) / montantMax;

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
    capaciteAchatNet,
    apportAttendu,
    ltvCible: Math.round(ltvCible * 100),
    ltvEffectif: Math.round(ltvEffectif * 100),
  };
}
