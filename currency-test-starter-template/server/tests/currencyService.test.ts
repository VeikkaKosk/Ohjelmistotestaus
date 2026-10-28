import { afterEach, describe, expect, test, vi } from 'vitest';
import { convert } from '../services/currencyService';

describe('Currency service', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('converts an amount using the fetched exchange rate', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { SEK: 0.9 } }),
    }));

    await expect(convert('EUR', 'SEK', 10)).resolves.toEqual({ amount: 9 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('?from=EUR&to=SEK'),
    );
  });

  test('reports an error when the exchange rate request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(convert('EUR', 'SEK', 10)).rejects.toThrow(
      'Error retrieving exchange rate.',
    );
  });

  test('reports an error when the response has no requested exchange rate', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: {} }),
    }));

    await expect(convert('EUR', 'SEK', 10)).rejects.toThrow(
      'Exchange rate is not a number.',
    );
  });
});