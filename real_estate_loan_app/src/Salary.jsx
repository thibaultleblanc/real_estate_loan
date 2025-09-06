import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  FormControl,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";

const HEURES_MENSUELLES = 151.67;
const NB_MOIS = 12;

function Salary({ brutAnnuel, setBrutAnnuel, isCadre, setIsCadre, updateNetMensuel }) {
  const [primes, setPrimes] = useState("");
  const [intpart, setIntpart] = useState("");
  const [abondement, setAbondement] = useState("");
  const [isFiscalise, setIsFiscalise] = useState(false);

  const taux = isCadre ? 0.75 : 0.77;
  const tauxAffichage = isCadre ? "25%" : "23%";

  const brutValue = parseFloat(brutAnnuel) || 0;
  const netValue = brutValue * taux;

  const mensuelBrut = (brutValue / NB_MOIS).toFixed(2);
  const mensuelNet = (netValue / NB_MOIS).toFixed(2);
  const horaireBrut = (brutValue / (NB_MOIS * HEURES_MENSUELLES)).toFixed(2);
  const horaireNet = (netValue / (NB_MOIS * HEURES_MENSUELLES)).toFixed(2);
  const annuelBrut = brutAnnuel;
  const annuelNet = netValue.toFixed(2);

  const avantagesBrut = (primes || 0) + (intpart || 0) + (abondement || 0);

  const totalBrut = brutValue + avantagesBrut;
  const totalBrutMensuel = (totalBrut / NB_MOIS).toFixed(2);
  const totalNetMensuel = (taux * totalBrut / NB_MOIS).toFixed(2);
  updateNetMensuel(totalNetMensuel);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      {/* Bandeau Revenus */}
      <Box
        sx={{
          width: { xs: "95%", md: "90%" },
          background: "#1976d2",
          color: "#fff",
          py: 1,
          px: 2,
          borderRadius: 1,
          mb: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
          letterSpacing: 1,
          mx: "auto",
        }}
      >
        Revenus
      </Box>

      {/* Première ligne : 2 colonnes */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Colonne Salaire */}
        <Box sx={{ minWidth: 350, flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Salaire
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Brut (€)</TableCell>
                  <TableCell>Net (€)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Horaire</TableCell>
                  <TableCell>{horaireBrut}</TableCell>
                  <TableCell>{horaireNet}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mensuel</TableCell>
                  <TableCell>{mensuelBrut}</TableCell>
                  <TableCell>{mensuelNet}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Annuel</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={brutAnnuel}
                      onChange={(e) => setBrutAnnuel(e.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </TableCell>
                  <TableCell>{annuelNet}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Colonne Avantages */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 350,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Avantages
          </Typography>
          <FormControl variant="standard" sx={{ width: "80%", mb: 2 }}>
            <TextField
              id="primes"
              label="Primes brutes"
              variant="standard"
              value={primes}
              onChange={(e) => setPrimes(parseFloat(e.target.value) || "")}
              size="small"
              fullWidth
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              id="intpart"
              label="Intéressement / Participation"
              variant="standard"
              value={intpart}
              onChange={(e) => setIntpart(parseFloat(e.target.value) || "")}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isFiscalise}
                  onChange={() => setIsFiscalise(!isFiscalise)}
                  color="primary"
                />
              }
              label="Fiscalisé"
              sx={{ ml: 2 }}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: "80%" }}>
            <TextField
              id="abondement"
              label="Abondement"
              variant="standard"
              value={abondement}
              onChange={(e) =>
                setAbondement(parseFloat(e.target.value) || "")
              }
              size="small"
              fullWidth
            />
          </FormControl>
        </Box>
      </Box>

      {/* Deuxième ligne : bandeau détails */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mt: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography>Nombre d&apos;heures : {HEURES_MENSUELLES}</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isCadre}
              onChange={() => setIsCadre(!isCadre)}
              color="primary"
            />
          }
          label={isCadre ? "Cadre" : "Non cadre"}
          sx={{ mr: 2 }}
        />
        <Typography>Taux : {tauxAffichage}</Typography>
        <Typography>Total brut annuel : {totalBrut}</Typography>
        <Typography>Total brut mensuel : {totalBrutMensuel}</Typography>
        <Typography>Total net mensuel : {totalNetMensuel}</Typography>
      </Box>
    </Box>
  );
}

export default Salary;
