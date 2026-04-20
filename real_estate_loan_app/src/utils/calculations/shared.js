export function parseAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatAmount(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return (0).toFixed(digits);
  }

  return value.toFixed(digits);
}
