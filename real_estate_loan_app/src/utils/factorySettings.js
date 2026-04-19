export const FACTORY_TAX_BRACKETS = [
  { upTo: 11600, rate: 0 },
  { upTo: 29579, rate: 0.11 },
  { upTo: 84577, rate: 0.3 },
  { upTo: 181917, rate: 0.41 },
  { upTo: null, rate: 0.45 },
];

export const DEFAULT_FACTORY_SETTINGS = {
  heuresMensuelles: 151.67,
  nbMois: 12,
  tauxCadre: 0.75,
  tauxNonCadre: 0.77,
  tauxEndettement: 0.35,
  fraisNotaireNeuf: 0.02,
  fraisNotaireAncien: 0.08,
  taxBrackets: FACTORY_TAX_BRACKETS.map((bracket) => ({ ...bracket })),
};
