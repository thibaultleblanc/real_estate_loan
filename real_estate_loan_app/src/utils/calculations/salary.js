import { DEFAULT_FACTORY_SETTINGS } from "../factorySettings";
import { calculateTaxBreakdown } from "./tax";
import { parseAmount } from "./shared";

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

  const taxBreakdown = calculateTaxBreakdown(baseImposableAnnuelle, settings);
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
    taxBreakdown,
    impotAnnuel,
    impotMensuel: impotAnnuel / settings.nbMois,
    totalNetApresImpotAnnuel,
    totalNetApresImpotMensuel: totalNetApresImpotAnnuel / settings.nbMois,
  };
}
