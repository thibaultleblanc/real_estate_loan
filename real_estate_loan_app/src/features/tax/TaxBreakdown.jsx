import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatAmount } from "../../utils/calculations";
import { BRAND_COLORS } from "../../themeTokens";

function TaxBreakdown({
  taxBreakdown,
  annualTax,
  monthlyTax,
  nbMois = 12,
  taxRate,
  isSliderTouched,
  onTaxRateChange,
}) {
  const breakdown = taxBreakdown || { brackets: [], totalTax: 0 };
  const [expanded, setExpanded] = useState(false);
  const sliderValue = Number.isFinite(Number(taxRate)) ? Number(taxRate) : 0;
  const annualTaxDisplay = Number.isFinite(Number(annualTax))
    ? Number(annualTax)
    : 0;
  const monthlyTaxDisplay = Number.isFinite(Number(monthlyTax))
    ? Number(monthlyTax)
    : annualTaxDisplay / (Number(nbMois) || 12);

  return (
    <Paper sx={{ p: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Impot ajuste
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {formatAmount(annualTaxDisplay)} € / an
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {formatAmount(monthlyTaxDisplay)} € / mois
          </Typography>
        </Box>
        <Box sx={{ width: { xs: "100%", sm: 260 } }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Taux d&apos;imposition : {sliderValue.toFixed(1)}%
          </Typography>
          <Slider
            value={sliderValue}
            min={0}
            max={60}
            step={0.1}
            valueLabelDisplay="auto"
            onChange={(_, nextValue) => {
              const value = Array.isArray(nextValue) ? nextValue[0] : nextValue;
              onTaxRateChange?.(String(value));
            }}
            aria-label="Taux d'imposition"
          />
        </Box>
        <Button
          variant="text"
          onClick={() => setExpanded((prev) => !prev)}
          sx={{
            color: BRAND_COLORS.primary,
            fontWeight: 700,
            alignSelf: { xs: "flex-start", sm: "center" },
          }}
        >
          {expanded ? "Masquer le detail" : "Voir le detail"}
        </Button>
      </Box>

      <Collapse in={expanded}>
        <TableContainer
          sx={{
            mt: 1,
            opacity: isSliderTouched ? 0.45 : 1,
            filter: isSliderTouched ? "grayscale(0.25)" : "none",
            transition: "opacity 180ms ease, filter 180ms ease",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tranche (€)</TableCell>
                <TableCell align="right">Taux</TableCell>
                <TableCell align="right">Base taxee (€)</TableCell>
                <TableCell align="right">Impot (€)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breakdown.brackets.map((row) => (
                <TableRow key={`${row.label}-${row.rate}`}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell align="right">
                    {(row.rate * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell align="right">
                    {formatAmount(row.taxableAmount)}
                  </TableCell>
                  <TableCell align="right">
                    {formatAmount(row.taxAmount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell />
                <TableCell />
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatAmount(breakdown.totalTax)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
}

export default TaxBreakdown;
