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
import { formatAmount, HEURES_MENSUELLES } from "./utils/calculations";

function Salary({ salary, metrics, onFieldChange }) {
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
          background: "linear-gradient(120deg, #4F46E5 0%, #8B5CF6 100%)",
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
                  <TableCell>{formatAmount(metrics.horaireBrut)}</TableCell>
                  <TableCell>{formatAmount(metrics.horaireNet)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mensuel</TableCell>
                  <TableCell>{formatAmount(metrics.mensuelBrut)}</TableCell>
                  <TableCell>{formatAmount(metrics.mensuelNet)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Annuel</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={salary.brutAnnuel}
                      onChange={(e) =>
                        onFieldChange("brutAnnuel", e.target.value)
                      }
                      inputProps={{ min: 0, step: 0.01 }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </TableCell>
                  <TableCell>{formatAmount(metrics.annuelNet)}</TableCell>
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
              value={salary.primes}
              onChange={(e) => onFieldChange("primes", e.target.value)}
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
              value={salary.intpart}
              onChange={(e) => onFieldChange("intpart", e.target.value)}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={salary.isFiscalise}
                  onChange={() =>
                    onFieldChange("isFiscalise", !salary.isFiscalise)
                  }
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
              value={salary.abondement}
              onChange={(e) => onFieldChange("abondement", e.target.value)}
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
              checked={salary.isCadre}
              onChange={() => onFieldChange("isCadre", !salary.isCadre)}
              color="primary"
            />
          }
          label={salary.isCadre ? "Cadre" : "Non cadre"}
          sx={{ mr: 2 }}
        />
        <Typography>Taux : {metrics.tauxAffichage}</Typography>
        <Typography>
          Total brut annuel : {formatAmount(metrics.totalBrut)}
        </Typography>
        <Typography>
          Total brut mensuel : {formatAmount(metrics.totalBrutMensuel)}
        </Typography>
        <Typography>
          Total net mensuel : {formatAmount(metrics.totalNetMensuel)}
        </Typography>
      </Box>
    </Box>
  );
}

export default Salary;
