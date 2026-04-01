/**
 * Intl API Integration
 * Locale-aware formatting for dates, times, currency, and numbers
 */
import React from 'react';

export interface LocaleConfig {
  locale: string;
  region: string;
  currency: string;
  dateFormat: Intl.DateTimeFormat;
  timeFormat: Intl.DateTimeFormat;
  numberFormat: Intl.NumberFormat;
  currencyFormat: Intl.NumberFormat;
}

/**
 * Get user's locale configuration
 */
export function getLocaleConfig(): LocaleConfig {
  const locale = navigator.language || 'en-US';
  const [language, region = 'US'] = locale.split('-');

  const currencyMap: Record<string, string> = {
    'IN': 'INR',
    'US': 'USD',
    'GB': 'GBP',
    'EUR': 'EUR',
    'JP': 'JPY',
    'AU': 'AUD',
    'CA': 'CAD',
  };

  const currency = currencyMap[region] || 'USD';

  return {
    locale,
    region,
    currency,
    dateFormat: new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    timeFormat: new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: locale.startsWith('en-US') || locale.startsWith('en-AU'),
    }),
    numberFormat: new Intl.NumberFormat(locale),
    currencyFormat: new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
  };
}

/**
 * Format date according to user's locale
 */
export function formatDate(date: Date | number): string {
  const config = getLocaleConfig();
  return config.dateFormat.format(date);
}

/**
 * Format time according to user's locale
 */
export function formatTime(date: Date | number): string {
  const config = getLocaleConfig();
  return config.timeFormat.format(date);
}

/**
 * Format datetime according to user's locale
 */
export function formatDateTime(date: Date | number): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Format currency according to user's locale
 */
export function formatCurrency(amount: number): string {
  const config = getLocaleConfig();
  return config.currencyFormat.format(amount);
}

/**
 * Format number according to user's locale
 */
export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions
): string {
  const locale = navigator.language || 'en-US';
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format file size with proper locale and units
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const locale = navigator.language || 'en-US';
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(size);

  return `${formatted} ${units[unitIndex]}`;
}

/**
 * Format duration/time difference
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const locale = navigator.language || 'en-US';

  if (days > 0) {
    return new Intl.PluralRules(locale).select(days) === 'one' ? `${days} day` : `${days} days`;
  }
  if (hours > 0) {
    return new Intl.PluralRules(locale).select(hours) === 'one' ? `${hours} hour` : `${hours} hours`;
  }
  if (minutes > 0) {
    return new Intl.PluralRules(locale).select(minutes) === 'one' ? `${minutes} minute` : `${minutes} minutes`;
  }
  return new Intl.PluralRules(locale).select(seconds) === 'one' ? `${seconds} second` : `${seconds} seconds`;
}

/**
 * Get currency symbol for user's locale
 */
export function getCurrencySymbol(): string {
  const config = getLocaleConfig();
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  })
    .formatToParts(0)
    .find(part => part.type === 'currency')?.value || '$';
}

/**
 * React hook for locale-aware formatting
 */
export function useLocaleFormat() {
  const config = React.useMemo(() => getLocaleConfig(), []);

  return {
    locale: config.locale,
    currency: config.currency,
    formatDate,
    formatTime,
    formatDateTime,
    formatCurrency,
    formatNumber,
    formatFileSize,
    formatDuration,
    getCurrencySymbol,
  };
}

/**
 * Component examples
 */

export function FormattedDate({ date = new Date() }: { date?: Date | number }) {
  return <span>{formatDate(date)}</span>;
}

export function FormattedTime({ date = new Date() }: { date?: Date | number }) {
  return <span>{formatTime(date)}</span>;
}

export function FormattedFileSize({ bytes }: { bytes: number }) {
  return <span>{formatFileSize(bytes)}</span>;
}

export function FormattedCurrency({ amount }: { amount: number }) {
  return <span>{formatCurrency(amount)}</span>;
}

export function FormattedDuration({ milliseconds }: { milliseconds: number }) {
  return <span>{formatDuration(milliseconds)}</span>;
}
