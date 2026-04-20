import { Alert, Box, Button, Stack } from "@mui/material";
import FactorySettingsDrawer from "../settings/FactorySettingsDrawer";
import Header from "../../layout/Header";
import StepContent from "./StepContent";
import ScenarioToolbar from "./ScenarioToolbar";
import { BRAND_COLORS } from "../../themeTokens";
import { useScenarioController } from "./useScenarioController";

function ScenarioView() {
  const {
    scenario,
    errorMessage,
    isSettingsOpen,
    isTaxSliderTouched,
    fileInputRef,
    salaryMetrics,
    loanMetrics,
    setCurrentStep,
    updateSalaryField,
    updateLoanField,
    updateSettingField,
    resetFactorySettings,
    toggleSettings,
    handleReset,
    handleExport,
    handleImportRequest,
    handleImportFile,
  } = useScenarioController();

  return (
    <Box
      className="main-view"
      sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <Header
        currentStep={scenario.currentStep}
        onStepChange={setCurrentStep}
      />

      <FactorySettingsDrawer
        open={isSettingsOpen}
        onClose={toggleSettings}
        settings={scenario.settings}
        onSettingChange={updateSettingField}
        onReset={resetFactorySettings}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 4 },
          pb: 3,
        }}
      >
        <ScenarioToolbar
          scenario={scenario}
          onExport={handleExport}
          onImportRequest={handleImportRequest}
          onReset={handleReset}
        />

        <input
          type="file"
          accept="application/json,.json"
          ref={fileInputRef}
          onChange={handleImportFile}
          style={{ display: "none" }}
        />

        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Box
          sx={{
            borderRadius: 3,
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 2 },
            background: "rgba(255,255,255,0.5)",
            border: `1px solid ${BRAND_COLORS.primarySelected}`,
          }}
        >
          <StepContent
            currentStep={scenario.currentStep}
            scenario={scenario}
            salaryMetrics={salaryMetrics}
            loanMetrics={loanMetrics}
            isTaxSliderTouched={isTaxSliderTouched}
            onSalaryFieldChange={updateSalaryField}
            onLoanFieldChange={updateLoanField}
          />
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            disabled={scenario.currentStep === 0}
            onClick={() => setCurrentStep(scenario.currentStep - 1)}
          >
            Precedent
          </Button>
          <Button
            variant="contained"
            disabled={scenario.currentStep === 2}
            onClick={() => setCurrentStep(scenario.currentStep + 1)}
          >
            Suivant
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default ScenarioView;
