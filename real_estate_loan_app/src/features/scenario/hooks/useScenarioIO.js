import { useEffect, useRef, useState } from "react";
import {
  createDefaultScenario,
  exportScenarioToFile,
  importScenarioFromFile,
  loadScenarioFromStorage,
  resetScenarioStorage,
  saveScenarioToStorage,
} from "../../../utils/scenarioStorage";

export function useScenarioIO() {
  const [scenario, setScenario] = useState(() => loadScenarioFromStorage());
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    saveScenarioToStorage(scenario);
  }, [scenario]);

  function resetScenarioData() {
    setScenario(createDefaultScenario());
    resetScenarioStorage();
    setErrorMessage("");
  }

  function handleExport() {
    exportScenarioToFile(scenario);
    setErrorMessage("");
  }

  function handleImportRequest() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const importedScenario = await importScenarioFromFile(file);
      setScenario(importedScenario);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Echec de l'import du scenario.");
    } finally {
      event.target.value = "";
    }
  }

  return {
    scenario,
    setScenario,
    errorMessage,
    setErrorMessage,
    fileInputRef,
    resetScenarioData,
    handleExport,
    handleImportRequest,
    handleImportFile,
  };
}
