import {
  DEFAULT_FACTORY_SETTINGS,
  FACTORY_TAX_BRACKETS,
} from "./factorySettings";

function parseAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTaxBrackets(settings = DEFAULT_FACTORY_SETTINGS) {
  if (Array.isArray(settings?.taxBrackets) && settings.taxBrackets.length > 0) {
    return settings.taxBrackets;
  }

  return FACTORY_TAX_BRACKETS;
}

export function estimateTaxRateFromTaxableIncome(
  annualTaxableIncome,
  settings = DEFAULT_FACTORY_SETTINGS,
) {
  const { income, totalTax } = calculateTaxBreakdown(
    annualTaxableIncome,
    settings,
  );
  if (income <= 0) {
    return 0;
  }

  const averageRatePercent = (totalTax / income) * 100;
  return Math.max(0, Math.min(60, Number(averageRatePercent.toFixed(1))));
}

export function calculateTaxBreakdown(
  annualTaxableIncome,
  settings = DEFAULT_FACTORY_SETTINGS,
) {
  const income = Math.max(0, parseAmount(annualTaxableIncome));
  const taxBrackets = getTaxBrackets(settings);
  if (income <= 0) {
    return {
      income: 0,
      brackets: taxBrackets.map((bracket, index) => {
        const lowerBound =
          index === 0 ? 0 : Number(taxBrackets[index - 1].upTo) + 1;
        const upperBound = bracket.upTo;
        const label =
          upperBound === null
            ? `>${lowerBound - 1}`
            : Number.isFinite(upperBound)
              ? `${lowerBound} - ${upperBound}`
              : `>${lowerBound - 1}`;
        return {
          label,
          rate: bracket.rate,
          taxableAmount: 0,
          taxAmount: 0,
        };
      }),
      totalTax: 0,
    };
  }

  let remaining = income;
  let previousUpperBound = 0;
  let totalTax = 0;
  const brackets = taxBrackets.map((bracket, index) => {
    const lowerBound =
      index === 0 ? 0 : Number(taxBrackets[index - 1].upTo) + 1;
    const upperBound =
      bracket.upTo === null ? Number.POSITIVE_INFINITY : bracket.upTo;
    const bracketWidth = upperBound - previousUpperBound;
    const taxableAmount = Math.max(0, Math.min(remaining, bracketWidth));
    const taxAmount = taxableAmount * bracket.rate;
    const label =
      bracket.upTo === null
        ? `>${lowerBound - 1}`
        : Number.isFinite(upperBound)
          ? `${lowerBound} - ${upperBound}`
          : `>${lowerBound - 1}`;

    remaining -= taxableAmount;
    previousUpperBound = upperBound;
    totalTax += taxAmount;

    return {
      label,
      rate: bracket.rate,
      taxableAmount,
      taxAmount,
    };
  });

  return {
    income,
    brackets,
    totalTax,
  };
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
