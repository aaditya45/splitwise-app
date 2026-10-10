const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatExpenseDate(value?: string | null): string {
  if (!value) return '';

  // Parse "yyyy-mm-ddTHH:mm:ss" manually to avoid timezone shifts and Hermes Date quirks
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;

  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return value;

  const now = new Date();
  const sameYear = Number(year) === now.getFullYear();

  return sameYear
    ? `${Number(day)} ${monthName}`
    : `${Number(day)} ${monthName} ${year}`;
}

