export function parseExcelDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Try parsing MM/DD/YYYY format
    const [month, day, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day).toISOString();
  }
  return date.toISOString();
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
}