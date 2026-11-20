export function roundedEstimate(aud, rate, currency = 'USD') {
  if (!Number.isFinite(aud) || aud < 0 || !Number.isFinite(rate) || rate <= 0) throw new Error('Invalid estimate');
  const digits = Math.min(2, new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits);
  const scale = 10 ** digits;
  const converted = aud * rate * scale;
  return Math.ceil(converted - Number.EPSILON * Math.max(1, converted) * 4) / scale;
}
export function money(amount, currency = 'AUD') {
  const digits = Math.min(2, new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits);
  const value = new Intl.NumberFormat('en-AU', { style: 'currency', currency, currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : digits, maximumFractionDigits: digits }).format(amount);
  return currency === 'AUD' ? value.replace('$', 'A$') : value;
}

export function amountIssue(value) {
  if (!value.trim()) return 'Enter your amount.';
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(value)) return 'Use an amount with up to two decimal places.';
  if (Number(value) < 5) return 'A$5 minimum for one-time support.';
  if (Number(value) > 10000) return 'Please choose a smaller amount.';
  return '';
}
