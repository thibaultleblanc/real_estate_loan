import { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MainView from "./MainView.jsx";
import { Box } from "@mui/material";
import "./App.css";

function App() {

  return (
    <Box
      className="App"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: 12 }}
    >
      <Header />
      <MainView/>
      <Footer />
    </Box>
  );
}

export default App;
