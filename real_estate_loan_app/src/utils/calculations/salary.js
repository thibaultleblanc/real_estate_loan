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
  const netPrimes = (salary.primesPeePerco ? 1 : taux) * primesValue;
  const netPrimePartageValeur =
    (salary.primePartageValeurPeePerco ? 1 : taux) * primePartageValeurValue;
  const netInteressement =
    (salary.interessementPeePerco ? 1 : taux) * interessementValue;
  const netParticipation =
    (salary.participationPeePerco ? 1 : taux) * participationValue;
  const netAbondement =
    (salary.abondementPeePerco ? 1 : taux) * abondementValue;

  const taxablePrimes = salary.primesPeePerco ? 0 : netPrimes;
  const taxablePrimePartageValeur = salary.primePartageValeurPeePerco
    ? 0
    : netPrimePartageValeur;
  const taxableInteressement = salary.interessementPeePerco
    ? 0
    : netInteressement;
  const taxableParticipation = salary.participationPeePerco
    ? 0
    : netParticipation;
  const taxableAbondement = salary.abondementPeePerco ? 0 : netAbondement;

  const avantagesNet =
    netPrimes +
    netPrimePartageValeur +
    netInteressement +
    netParticipation +
    netAbondement;
  const totalBrut = brutValue + avantagesBrut;
  const totalNetAnnuel = netValue + avantagesNet;

  const stableAvantagesNet =
    (salary.primesStable ? netPrimes : 0) +
    (salary.primePartageValeurStable ? netPrimePartageValeur : 0) +
    (salary.interessementStable ? netInteressement : 0) +
    (salary.participationStable ? netParticipation : 0) +
    (salary.abondementStable ? netAbondement : 0);
  const stableNetAnnuel = netValue + stableAvantagesNet;
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
    stableAvantagesNet,
    stableNetAnnuel,
    stableNetMensuel: stableNetAnnuel / settings.nbMois,
    baseImposableAnnuelle,
    baseImposableMensuelle: baseImposableAnnuelle / settings.nbMois,
    taxBreakdown,
    impotAnnuel,
    impotMensuel: impotAnnuel / settings.nbMois,
    totalNetApresImpotAnnuel,
    totalNetApresImpotMensuel: totalNetApresImpotAnnuel / settings.nbMois,
  };
}
