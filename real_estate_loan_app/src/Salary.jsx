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
import { formatAmount } from "./utils/calculations";

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
              id="primes"
              label="Primes brutes"
              variant="standard"
              value={salary.primes}
              onChange={(e) => onFieldChange("primes", e.target.value)}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={salary.primesPegPerco}
                  onChange={() =>
                    onFieldChange("primesPegPerco", !salary.primesPegPerco)
                  }
                  color="primary"
                />
              }
              label="PEG/PERCO"
              sx={{ ml: 2 }}
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
              id="primePartageValeur"
              label="Prime de partage de la valeur"
              variant="standard"
              value={salary.primePartageValeur}
              onChange={(e) =>
                onFieldChange("primePartageValeur", e.target.value)
              }
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={salary.primePartageValeurPegPerco}
                  onChange={() =>
                    onFieldChange(
                      "primePartageValeurPegPerco",
                      !salary.primePartageValeurPegPerco,
                    )
                  }
                  color="primary"
                />
              }
              label="PEG/PERCO"
              sx={{ ml: 2 }}
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
              id="interessement"
              label="Interessement"
              variant="standard"
              value={salary.interessement}
              onChange={(e) => onFieldChange("interessement", e.target.value)}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={salary.interessementPegPerco}
                  onChange={() =>
                    onFieldChange(
                      "interessementPegPerco",
                      !salary.interessementPegPerco,
                    )
                  }
                  color="primary"
                />
              }
              label="PEG/PERCO"
              sx={{ ml: 2 }}
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
              id="participation"
              label="Participation"
              variant="standard"
              value={salary.participation}
              onChange={(e) => onFieldChange("participation", e.target.value)}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={salary.participationPegPerco}
                  onChange={() =>
                    onFieldChange(
                      "participationPegPerco",
                      !salary.participationPegPerco,
                    )
                  }
                  color="primary"
                />
              }
              label="PEG/PERCO"
              sx={{ ml: 2 }}
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
            }}
          >
            <TextField
              id="abondement"
              label="Abondement"
              variant="standard"
              value={salary.abondement}
              onChange={(e) => onFieldChange("abondement", e.target.value)}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={salary.abondementPegPerco}
                  onChange={() =>
                    onFieldChange(
                      "abondementPegPerco",
                      !salary.abondementPegPerco,
                    )
                  }
                  color="primary"
                />
              }
              label="PEG/PERCO"
              sx={{ ml: 2 }}
            />
          </FormControl>
        </Box>
      </Box>

      {/* Deuxième ligne : bandeau détails */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography>
            Nombre d&apos;heures : {formatAmount(metrics.heuresMensuelles)}
          </Typography>
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
          <Typography>
            Taux charges salariales : {metrics.tauxAffichage}
          </Typography>
          <TextField
            id="tauxImpot"
            label="Taux d'impot (%)"
            type="number"
            value={salary.tauxImpot}
            onChange={(e) => onFieldChange("tauxImpot", e.target.value)}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            size="small"
            sx={{ width: 150 }}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{ width: { xs: "100%", md: "90%" } }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="right">Annuel (€)</TableCell>
                <TableCell align="right">Mensuel (€)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Remuneration brute totale</TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.totalBrut)}
                </TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.totalBrutMensuel)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Remuneration nette totale</TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.totalNetAnnuel)}
                </TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.totalNetMensuel)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Base imposable nette</TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.baseImposableAnnuelle)}
                </TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.baseImposableMensuelle)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Net apres impot</TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.totalNetApresImpotAnnuel)}
                </TableCell>
                <TableCell align="right">
                  {formatAmount(metrics.totalNetApresImpotMensuel)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Salary;
