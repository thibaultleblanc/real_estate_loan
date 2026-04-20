import Footer from "./layout/Footer.jsx";
import MainView from "./MainView.jsx";
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
        <MainView />
        <Footer />
      </Box>
    </>
  );
}

export default App;
