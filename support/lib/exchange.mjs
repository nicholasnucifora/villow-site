import { HttpError } from './config.mjs';
let cached;
export async function exchangeRates(fetcher = fetch, now = Date.now()) {
  if (cached && cached.expires > now) return cached.data;
  const response = await fetcher('https://api.frankfurter.dev/v2/rates?base=AUD', {
    signal: AbortSignal.timeout(10000), headers: { Accept: 'application/json' },
    cf: { cacheTtl: 21600, cacheEverything: true },
  });
  if (!response.ok) throw new HttpError(503, 'Currency estimates are temporarily unavailable.');
  const records = await response.json();
  if (!Array.isArray(records)) throw new HttpError(503, 'Currency estimates are temporarily unavailable.');
  const rates = { AUD: 1 }; const dates = {}; let date = '';
  const currencies = new Set(Intl.supportedValuesOf('currency').filter(code => !['XAU', 'XAG', 'XPD', 'XPT', 'XDR', 'XXX', 'XTS'].includes(code)));
  for (const row of records) {
    const timestamp = Date.parse(row.date);
    if (row.base !== 'AUD' || !currencies.has(row.quote) || !Number.isFinite(row.rate) || row.rate <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !Number.isFinite(timestamp) || timestamp > now + 86400000 || now - timestamp > 7 * 86400000) continue;
    rates[row.quote] = row.rate; dates[row.quote] = row.date; if (!date || row.date < date) date = row.date;
  }
  if (Object.keys(rates).length < 2) throw new HttpError(503, 'Currency estimates are temporarily unavailable.');
  const data = { base: 'AUD', date, dates, rates, source: 'Frankfurter' };
  cached = { data, expires: now + 21600000 };
  return data;
}
