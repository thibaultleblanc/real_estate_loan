import { DEFAULT_FACTORY_SETTINGS } from "../factorySettings";

export const STORAGE_KEY = "real_estate_loan_scenario_v1";
export const SCENARIO_VERSION = 1;

export const DEFAULT_SCENARIO = {
  version: SCENARIO_VERSION,
  currentStep: 0,
  settings: { ...DEFAULT_FACTORY_SETTINGS },
  salary: {
    brutAnnuel: "55000",
    isCadre: true,
    tauxImpot: "0",
    primes: "",
    primePartageValeur: "",
    interessement: "",
    participation: "",
    abondement: "",
    primesPegPerco: false,
    primePartageValeurPegPerco: false,
    interessementPegPerco: false,
    participationPegPerco: false,
    abondementPegPerco: false,
  },
  loan: {
    duree: 20,
    tauxAnnuel: 3.5,
    apport: "0",
    isNeuf: false,
  },
};

export function createDefaultScenario() {
  return JSON.parse(JSON.stringify(DEFAULT_SCENARIO));
}
