import { useSettings } from '../context/SettingsContext';

/**
 * Custom hook to format currency based on user settings
 */
export const useFormatCurrency = () => {
  const { settings } = useSettings();
  
  const formatValue = (value: number, shorten: boolean = false) => {
    const { currency } = settings;
    
    // Simple conversion rates (Mock)
    let convertedValue = value;
    if (currency === 'USD') convertedValue = value * 1.25;
    if (currency === 'EUR') convertedValue = value * 1.17;
    
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: shorten ? 1 : 2,
      maximumFractionDigits: shorten ? 1 : 2,
    });

    if (shorten) {
      if (convertedValue >= 1000000) {
        return `${formatter.format(convertedValue / 1000000).replace(/[0-9.]/g, '').trim()}${ (convertedValue / 1000000).toFixed(1) }M`;
      }
      if (convertedValue >= 1000) {
        return `${formatter.format(convertedValue / 1000).replace(/[0-9.]/g, '').trim()}${ (convertedValue / 1000).toFixed(1) }K`;
      }
    }

    return formatter.format(convertedValue);
  };

  return formatValue;
};

// Legacy support or for non-component usage (defaulting to GBP)
export const formatCurrency = (value: number, shorten: boolean = false, currency: string = 'GBP') => {
  // Simple conversion rates (Mock)
  let convertedValue = value;
  if (currency === 'USD') convertedValue = value * 1.25;
  if (currency === 'EUR') convertedValue = value * 1.17;

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: shorten ? 1 : 2,
    maximumFractionDigits: shorten ? 1 : 2,
  });

  if (shorten) {
    if (convertedValue >= 1000000) {
      return `${formatter.format(convertedValue / 1000000).split(/\d/)[0]}${(convertedValue / 1000000).toFixed(1)}M`;
    }
    if (convertedValue >= 1000) {
      return `${formatter.format(convertedValue / 1000).split(/\d/)[0]}${(convertedValue / 1000).toFixed(1)}K`;
    }
  }

  return formatter.format(convertedValue);
};
