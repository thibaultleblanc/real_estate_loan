import { DEFAULT_FACTORY_SETTINGS } from "../factorySettings";

export const STORAGE_KEY = "real_estate_loan_scenario_v1";
export const SCENARIO_VERSION = 1;

export const DEFAULT_SCENARIO = {
  version: SCENARIO_VERSION,
  currentStep: 0,
  settings: { ...DEFAULT_FACTORY_SETTINGS },
  salary: {
    brutAnnuel: "42000",
    isCadre: true,
    tauxImpot: "0",
    primes: "",
    primePartageValeur: "",
    interessement: "",
    participation: "",
    abondement: "",
    primesPeePerco: false,
    primePartageValeurPeePerco: false,
    interessementPeePerco: false,
    participationPeePerco: false,
    abondementPeePerco: false,
    primesStable: false,
    primePartageValeurStable: false,
    interessementStable: false,
    participationStable: false,
    abondementStable: false,
  },
  loan: {
    duree: 20,
    tauxAnnuel: 3.5,
    tauxAssuranceAnnuel: 0.35,
    tauxFraisGarantie: 2,
    loanToValue: 80,
    apport: "0",
    isNeuf: false,
    revenuNetBancaire: "",
  },
  project: {
    valeurBien: "",
    surface: "",
    hasParking: false,
    valeurParking: "",
    revenuNetBancaire: "",
    montantEmprunte: "",
    dureePret: 20,
    tauxAnnuelPret: "",
    tauxAssurancePret: "",
  },
};

export function createDefaultScenario() {
  return JSON.parse(JSON.stringify(DEFAULT_SCENARIO));
}
