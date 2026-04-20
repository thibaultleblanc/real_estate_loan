import {
  DEFAULT_FACTORY_SETTINGS,
  FACTORY_TAX_BRACKETS,
} from "../factorySettings";
import { parseAmount } from "./shared";

function getTaxBrackets(settings = DEFAULT_FACTORY_SETTINGS) {
  if (Array.isArray(settings?.taxBrackets) && settings.taxBrackets.length > 0) {
    return settings.taxBrackets;
  }

  return FACTORY_TAX_BRACKETS;
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
