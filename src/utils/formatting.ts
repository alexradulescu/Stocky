/**
 * Format number as USD currency
 * e.g., 1234.56 -> "$1,234.56"
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number as SGD currency
 * e.g., 1234.56 -> "S$1,234.56"
 */
export function formatSGD(value: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with thousand separators (no currency)
 * e.g., 1234 -> "1,234"
 */
export function formatUnits(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.floor(value));
}

/**
 * Format percentage
 * e.g., 25 -> "25%"
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Format date to readable format
 * e.g., "2024-01-15" -> "Jan 15, 2024"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date input (YYYY-MM-DD) to ISO string
 */
export function parseInputDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString();
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

/**
 * Get first day of next month as ISO string
 */
export function getFirstDayOfNextMonthISO(): string {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
