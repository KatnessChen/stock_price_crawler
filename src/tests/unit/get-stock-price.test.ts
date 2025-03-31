import { getStockPrice } from '../../utils/get-stock-price';
import axios from 'axios';
import { isWithin30Days } from '../../utils/date';

jest.mock('axios');
jest.mock('../../utils/date');

describe('getStockPrice', () => {
  const mockApiKey = 'mock-api-key';
  const mockSymbol = 'AAPL';
  const mockDate = '2023-05-05';
  const mockPrice = '150.00';
  const mockVolume = '100000';

  beforeAll(() => {
    jest.clearAllMocks();
    process.env.ALPHA_VANTAGE_API_KEY = mockApiKey;
  });

  afterAll(() => {
    delete process.env.ALPHA_VANTAGE_API_KEY;
  });

  it('should fetch stock price data successfully with outputsize "compact" for dates within 30 days', async () => {
    (isWithin30Days as jest.Mock).mockReturnValueOnce(true);

    const mockResponse = {
      data: {
        'Time Series (Daily)': {
          [mockDate]: {
            '1. open': mockPrice,
            '2. high': mockPrice,
            '3. low': mockPrice,
            '4. close': mockPrice,
            '5. volume': mockVolume,
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await getStockPrice(mockSymbol, mockDate);

    expect(axios.get).toHaveBeenCalledWith('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: mockSymbol,
        apikey: mockApiKey,
        outputsize: 'compact',
      },
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Dimensions: [{ Name: 'Symbol', Value: mockSymbol }],
          MeasureName: 'StockPrice',
          MeasureValues: [
            { Name: 'Open', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'High', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'Low', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'Close', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'Volume', Value: mockVolume, Type: 'DOUBLE' },
            { Name: 'Date', Value: mockDate, Type: 'VARCHAR' },
          ],
          MeasureValueType: 'MULTI',
          TimeUnit: 'MILLISECONDS',
        }),
      ])
    );
  });

  it('should fetch stock price data successfully with outputsize "full" for dates older than 30 days', async () => {
    (isWithin30Days as jest.Mock).mockReturnValueOnce(false);

    const mockResponse = {
      data: {
        'Time Series (Daily)': {
          [mockDate]: {
            '1. open': mockPrice,
            '2. high': mockPrice,
            '3. low': mockPrice,
            '4. close': mockPrice,
            '5. volume': mockVolume,
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await getStockPrice(mockSymbol, mockDate);

    expect(axios.get).toHaveBeenCalledWith('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: mockSymbol,
        apikey: mockApiKey,
        outputsize: 'full',
      },
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Dimensions: [{ Name: 'Symbol', Value: mockSymbol }],
          MeasureName: 'StockPrice',
          MeasureValues: [
            { Name: 'Open', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'High', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'Low', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'Close', Value: mockPrice, Type: 'DOUBLE' },
            { Name: 'Volume', Value: mockVolume, Type: 'DOUBLE' },
            { Name: 'Date', Value: mockDate, Type: 'VARCHAR' },
          ],
          MeasureValueType: 'MULTI',
          TimeUnit: 'MILLISECONDS',
        }),
      ])
    );
  });

  it('should throw an error if API key is missing', async () => {
    delete process.env.ALPHA_VANTAGE_API_KEY;

    await expect(getStockPrice(mockSymbol, mockDate)).rejects.toThrow(
      'API key is missing. Please set ALPHA_VANTAGE_API_KEY in your environment variables.'
    );
  });

  it('should handle API errors gracefully', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    await expect(getStockPrice(mockSymbol, mockDate)).rejects.toThrow(Error);
  });
});
