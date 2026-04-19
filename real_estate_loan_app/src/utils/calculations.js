import { DEFAULT_FACTORY_SETTINGS } from "./factorySettings";

function parseAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getSalaryRate(isCadre, settings = DEFAULT_FACTORY_SETTINGS) {
  return isCadre ? settings.tauxCadre : settings.tauxNonCadre;
}

export function calculateSalaryMetrics(
  salary,
  settings = DEFAULT_FACTORY_SETTINGS,
) {
  const brutValue = parseAmount(salary.brutAnnuel);
  const tauxImpot = Math.max(0, Math.min(100, parseAmount(salary.tauxImpot)));
  const tauxImpotDecimal = tauxImpot / 100;
  const primesValue = parseAmount(salary.primes);
  const primePartageValeurValue = parseAmount(salary.primePartageValeur);
  const interessementValue = parseAmount(salary.interessement);
  const participationValue = parseAmount(salary.participation);
  const abondementValue = parseAmount(salary.abondement);
  const avantagesBrut =
    primesValue +
    primePartageValeurValue +
    interessementValue +
    participationValue +
    abondementValue;

  const taux = getSalaryRate(salary.isCadre, settings);
  const netValue = brutValue * taux;
  const netPrimes = (salary.primesPegPerco ? 1 : taux) * primesValue;
  const netPrimePartageValeur =
    (salary.primePartageValeurPegPerco ? 1 : taux) * primePartageValeurValue;
  const netInteressement =
    (salary.interessementPegPerco ? 1 : taux) * interessementValue;
  const netParticipation =
    (salary.participationPegPerco ? 1 : taux) * participationValue;
  const netAbondement =
    (salary.abondementPegPerco ? 1 : taux) * abondementValue;
  const taxablePrimes = salary.primesPegPerco ? 0 : netPrimes;
  const taxablePrimePartageValeur = salary.primePartageValeurPegPerco
    ? 0
    : netPrimePartageValeur;
  const taxableInteressement = salary.interessementPegPerco
    ? 0
    : netInteressement;
  const taxableParticipation = salary.participationPegPerco
    ? 0
    : netParticipation;
  const taxableAbondement = salary.abondementPegPerco ? 0 : netAbondement;
  const avantagesNet =
    netPrimes +
    netPrimePartageValeur +
    netInteressement +
    netParticipation +
    netAbondement;
  const totalBrut = brutValue + avantagesBrut;
  const totalNetAnnuel = netValue + avantagesNet;
  const baseImposableAnnuelle =
    netValue +
    taxablePrimes +
    taxablePrimePartageValeur +
    taxableInteressement +
    taxableParticipation +
    taxableAbondement;
  const impotAnnuel = baseImposableAnnuelle * tauxImpotDecimal;
  const totalNetApresImpotAnnuel = totalNetAnnuel - impotAnnuel;

  return {
    taux,
    tauxAffichage: `${((1 - taux) * 100).toFixed(0)}%`,
    tauxImpot,
    heuresMensuelles: settings.heuresMensuelles,
    nbMois: settings.nbMois,
    brutValue,
    netValue,
    mensuelBrut: brutValue / settings.nbMois,
    mensuelNet: netValue / settings.nbMois,
    horaireBrut: brutValue / (settings.nbMois * settings.heuresMensuelles),
    horaireNet: netValue / (settings.nbMois * settings.heuresMensuelles),
    annuelBrut: brutValue,
    annuelNet: netValue,
    avantagesBrut,
    avantagesNet,
    totalBrut,
    totalNetAnnuel,
    totalBrutMensuel: totalBrut / settings.nbMois,
    totalNetMensuel: totalNetAnnuel / settings.nbMois,
    baseImposableAnnuelle,
    baseImposableMensuelle: baseImposableAnnuelle / settings.nbMois,
    impotAnnuel,
    impotMensuel: impotAnnuel / settings.nbMois,
    totalNetApresImpotAnnuel,
    totalNetApresImpotMensuel: totalNetApresImpotAnnuel / settings.nbMois,
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
  settings = DEFAULT_FACTORY_SETTINGS,
}) {
  const mensualiteMax = netMensuel * settings.tauxEndettement;
  const montantMax = getMontantMax(mensualiteMax, loan.duree, loan.tauxAnnuel);
  const apportValue = parseAmount(loan.apport);
  const capaciteAchatBrut = montantMax + apportValue;
  const tauxFraisNotaire = loan.isNeuf
    ? settings.fraisNotaireNeuf
    : settings.fraisNotaireAncien;
  const fraisNotaire = capaciteAchatBrut * tauxFraisNotaire;

  return {
    mensualiteMax,
    montantMax,
    apportValue,
    tauxFraisNotaire,
    tauxEndettement: settings.tauxEndettement,
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
