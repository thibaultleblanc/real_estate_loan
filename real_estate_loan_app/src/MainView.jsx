import {
  Box,
} from "@mui/material";
import { useState } from "react";
import Salary from "./Salary";
import RealEstateLoan from "./RealEstateLoan";

function MainView() {

  const [brutAnnuel, setBrutAnnuel] = useState("55000");
  const [isCadre, setIsCadre] = useState(true);

  const [netMensuel, setNetMensuel] = useState(0);
  function updateNetMensuel(value) {
    setNetMensuel(value);
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <Salary
        brutAnnuel={brutAnnuel}
        setBrutAnnuel={setBrutAnnuel}
        isCadre={isCadre}
        setIsCadre={setIsCadre}
        netMensuel={netMensuel}
        updateNetMensuel={updateNetMensuel}
      />
      <RealEstateLoan netMensuel={netMensuel} />
    </Box>
  );
}

export default MainView;
