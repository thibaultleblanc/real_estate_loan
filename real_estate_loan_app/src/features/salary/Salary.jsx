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
import { formatAmount } from "../../utils/calculations";
import TaxBreakdown from "../tax/TaxBreakdown";
import { BRAND_GRADIENTS } from "../../themeTokens";

function Salary({ salary, metrics, isTaxSliderTouched, onFieldChange }) {
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
          background: BRAND_GRADIENTS.sectionBanner,
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
                      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
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
          <Box
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 64px 64px",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box />
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem", textAlign: "center" }}
            >
              PEE / PERCO
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem", textAlign: "center" }}
            >
              Stable
            </Typography>
          </Box>
          <FormControl
            variant="standard"
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 64px 64px",
              alignItems: "center",
              columnGap: 0.5,
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
            <Box />
            <Switch
              checked={salary.primesStable}
              onChange={() =>
                onFieldChange("primesStable", !salary.primesStable)
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Prime stable" }}
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 64px 64px",
              alignItems: "center",
              columnGap: 0.5,
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
            <Switch
              checked={salary.primePartageValeurPeePerco}
              onChange={() =>
                onFieldChange(
                  "primePartageValeurPeePerco",
                  !salary.primePartageValeurPeePerco,
                )
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Prime partage valeur PEE/PERCO" }}
            />
            <Switch
              checked={salary.primePartageValeurStable}
              onChange={() =>
                onFieldChange(
                  "primePartageValeurStable",
                  !salary.primePartageValeurStable,
                )
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Prime partage valeur stable" }}
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 64px 64px",
              alignItems: "center",
              columnGap: 0.5,
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
            <Switch
              checked={salary.interessementPeePerco}
              onChange={() =>
                onFieldChange(
                  "interessementPeePerco",
                  !salary.interessementPeePerco,
                )
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Interessement PEE/PERCO" }}
            />
            <Switch
              checked={salary.interessementStable}
              onChange={() =>
                onFieldChange(
                  "interessementStable",
                  !salary.interessementStable,
                )
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Interessement stable" }}
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 64px 64px",
              alignItems: "center",
              columnGap: 0.5,
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
            <Switch
              checked={salary.participationPeePerco}
              onChange={() =>
                onFieldChange(
                  "participationPeePerco",
                  !salary.participationPeePerco,
                )
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Participation PEE/PERCO" }}
            />
            <Switch
              checked={salary.participationStable}
              onChange={() =>
                onFieldChange(
                  "participationStable",
                  !salary.participationStable,
                )
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Participation stable" }}
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 64px 64px",
              alignItems: "center",
              columnGap: 0.5,
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
            <Switch
              checked={salary.abondementPeePerco}
              onChange={() =>
                onFieldChange("abondementPeePerco", !salary.abondementPeePerco)
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Abondement PEE/PERCO" }}
            />
            <Switch
              checked={salary.abondementStable}
              onChange={() =>
                onFieldChange("abondementStable", !salary.abondementStable)
              }
              color="primary"
              size="small"
              sx={{ justifySelf: "center" }}
              inputProps={{ "aria-label": "Abondement stable" }}
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
        </Box>

        <Box sx={{ width: { xs: "100%", md: "90%" } }}>
          <TaxBreakdown
            taxBreakdown={metrics.taxBreakdown}
            annualTax={metrics.impotAnnuel}
            monthlyTax={metrics.impotMensuel}
            nbMois={metrics.nbMois}
            taxRate={metrics.tauxImpot}
            isSliderTouched={isTaxSliderTouched}
            onTaxRateChange={(nextValue) =>
              onFieldChange("tauxImpot", nextValue)
            }
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
              <TableRow sx={{ fontWeight: "bold" }}>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Revenu net bancaire
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatAmount(metrics.stableNetAnnuel)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatAmount(metrics.stableNetMensuel)}
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
