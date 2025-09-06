import { Box, Typography, TextField, FormControl, Slider, FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";

// Fonction de calcul de mensualité maximale (35% du net mensuel)
function getMensualiteMax(netMensuel) {
  return netMensuel * 0.35;
}

// Fonction de calcul du montant maximal empruntable
function getMontantMax(mensualite, duree, tauxAnnuel) {
  const n = duree * 12;
  const tauxMensuel = tauxAnnuel / 12 / 100;
  if (tauxMensuel === 0) return mensualite * n;
  return (
    (mensualite * (1 - Math.pow(1 + tauxMensuel, -n))) / tauxMensuel
  );
}

function RealEstateLoan({ netMensuel }) {
  const [duree, setDuree] = useState(20); // durée en années
  const [tauxAnnuel, setTauxAnnuel] = useState(3.5); // taux d'intérêt annuel en %
  const [apport, setApport] = useState(0); // nouvel état pour l'apport
  const [isNeuf, setIsNeuf] = useState(false); // false = ancien, true = neuf

  const mensualiteMax = getMensualiteMax(netMensuel);
  const montantMax = getMontantMax(mensualiteMax, duree, tauxAnnuel);
  const capaciteAchatBrut = montantMax + Number(apport);

  // Frais de notaire : 2% neuf, 8% ancien
  const tauxFraisNotaire = isNeuf ? 0.02 : 0.08;
  const fraisNotaire = capaciteAchatBrut * tauxFraisNotaire;
  const capaciteAchatNet = capaciteAchatBrut - fraisNotaire;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 2,
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
        Simulation Prêt Immobilier
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: { xs: "100%", md: "80%" },
          justifyContent: "center",
        }}
      >
        {/* Colonne Inputs */}
        <FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
          <Typography gutterBottom>Durée (années) : {duree}</Typography>
          <Slider
            value={duree}
            min={10}
            max={25}
            step={1}
            onChange={(_, value) => setDuree(value)}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Taux annuel (%)"
            type="number"
            value={tauxAnnuel}
            onChange={(e) => setTauxAnnuel(Number(e.target.value))}
            size="small"
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Apport (€)"
            type="number"
            value={apport}
            onChange={(e) => setApport(e.target.value)}
            size="small"
            inputProps={{ min: 0, step: 1000 }}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isNeuf}
                onChange={() => setIsNeuf(!isNeuf)}
                color="primary"
              />
            }
            label={isNeuf ? "Logement neuf (2% frais de notaire)" : "Logement ancien (8% frais de notaire)"}
            sx={{ mt: 1 }}
          />
        </FormControl>
        {/* Colonne Résultats */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}
        >
          <Typography>
            Mensualité maximale (33% du net mensuel) : {mensualiteMax.toFixed(2)} €
          </Typography>
          <Typography>
            Montant maximal empruntable : {montantMax.toFixed(0)} €
          </Typography>
          <Typography>
            Apport personnel : {Number(apport).toFixed(0)} €
          </Typography>
          <Typography>
            Frais de notaire estimés : {fraisNotaire.toFixed(0)} €
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            Capacité d&apos;achat nette : {capaciteAchatNet.toFixed(0)} €
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default RealEstateLoan;