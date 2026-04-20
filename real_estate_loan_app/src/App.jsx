import Footer from "./layout/Footer.jsx";
import ScenarioView from "./features/scenario/ScenarioView.jsx";
import { Box, CssBaseline } from "@mui/material";
import "./App.css";

function App() {
  return (
    <>
      <CssBaseline />
      <Box
        className="app-shell"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          pb: 12,
        }}
      >
        <ScenarioView />
        <Footer />
      </Box>
    </>
  );
}

export default App;
