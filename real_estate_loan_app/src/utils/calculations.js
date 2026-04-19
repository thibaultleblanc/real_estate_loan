export const HEURES_MENSUELLES = 151.67;
export const NB_MOIS = 12;
export const DEBT_RATIO = 0.35;

function parseAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getSalaryRate(isCadre) {
  return isCadre ? 0.75 : 0.77;
}

export function calculateSalaryMetrics(salary) {
  const brutValue = parseAmount(salary.brutAnnuel);
  const primesValue = parseAmount(salary.primes);
  const intpartValue = parseAmount(salary.intpart);
  const abondementValue = parseAmount(salary.abondement);
  const avantagesBrut = primesValue + intpartValue + abondementValue;

  const taux = getSalaryRate(salary.isCadre);
  const netValue = brutValue * taux;
  const totalBrut = brutValue + avantagesBrut;
  const totalNetMensuel = (taux * totalBrut) / NB_MOIS;

  return {
    taux,
    tauxAffichage: salary.isCadre ? "25%" : "23%",
    brutValue,
    netValue,
    mensuelBrut: brutValue / NB_MOIS,
    mensuelNet: netValue / NB_MOIS,
    horaireBrut: brutValue / (NB_MOIS * HEURES_MENSUELLES),
    horaireNet: netValue / (NB_MOIS * HEURES_MENSUELLES),
    annuelBrut: brutValue,
    annuelNet: netValue,
    avantagesBrut,
    totalBrut,
    totalBrutMensuel: totalBrut / NB_MOIS,
    totalNetMensuel,
  };
}

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
  debtRatio = DEBT_RATIO,
}) {
  const mensualiteMax = netMensuel * debtRatio;
  const montantMax = getMontantMax(mensualiteMax, loan.duree, loan.tauxAnnuel);
  const apportValue = parseAmount(loan.apport);
  const capaciteAchatBrut = montantMax + apportValue;
  const tauxFraisNotaire = loan.isNeuf ? 0.02 : 0.08;
  const fraisNotaire = capaciteAchatBrut * tauxFraisNotaire;

  return {
    mensualiteMax,
    montantMax,
    apportValue,
    tauxFraisNotaire,
    fraisNotaire,
    capaciteAchatNet: capaciteAchatBrut - fraisNotaire,
  };
}

export function formatAmount(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return (0).toFixed(digits);
  }

  return value.toFixed(digits);
}
