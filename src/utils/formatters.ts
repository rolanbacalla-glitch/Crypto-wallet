/**
 * Formats a numeric value as a currency string based on the user's settings.
 * Default is GBP (£) with standard crypto formatting.
 */
export const formatCurrency = (
  value: number | string,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
) => {
  const {
    currency = 'GBP',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[£$,]/g, '')) : value;

  if (isNaN(numValue)) return '---';

  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(numValue);
};

/**
 * Formats a numeric value as a compact currency string (e.g., £2.42T, +£5.5k).
 */
export const formatCurrencyCompact = (value: number | string, currency = 'GBP') => {
  return formatCurrency(value, { currency, compact: true, maximumFractionDigits: 2 });
};
