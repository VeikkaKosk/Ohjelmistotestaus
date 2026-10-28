
import { describe, expect, test, vi } from 'vitest';
import { convertAmount } from '../controllers/currencyController';
import { convert } from '../services/currencyService';

vi.mock('../services/currencyService', () => ({
  convert: vi.fn(),
}));

const createMockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn();
  return res;
};

describe('CurrencyController.convertAmount', () => {
  test('Returns conversion with valid request', async () => {
    vi.mocked(convert).mockResolvedValue({ amount: 9 });
    const req: any = {
      body: { from: ' eur ', to: 'sek', amount: '10' },
    };
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ amount: 9 });
    expect(convert).toHaveBeenCalledWith('EUR', 'SEK', 10);
  });

  test('Returns 400 for invalid currency code', async () => {
    const req: any = {
      body: { from: 'EU', to: 'SEK', amount: 10 },
    };
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Currency codes must be 3-letter ISO abbreviations (e.g., USD, EUR).',
    });
  });

  test('Returns 400 for an invalid amount', async () => {
    const req: any = {
      body: { from: 'EUR', to: 'SEK', amount: -10 },
    };
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Amount must be greater than zero.',
    });
  });
});
