import axios from 'axios';
import { DateString, isWithin30Days } from './date';
import { transformAlphaVintageStockTimeSeriesToTimestreamStockPriceRecords } from './data-transformer';
import { TimeStreamStockPriceRecord } from '../types/base';

/**
 * Fetch stock price data from API
 * @param symbol Stock symbol to fetch
 * @param startsWith Optional date to filter results
 * @returns Promise with stock data
 */
export async function getStockPrice(
  symbol: string,
  startsWith?: DateString
): Promise<TimeStreamStockPriceRecord[] | Error> {
  try {
    const apikey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apikey) {
      throw new Error(
        'API key is missing. Please set ALPHA_VANTAGE_API_KEY in your environment variables.'
      );
    }

    const outputsize = startsWith && isWithin30Days(startsWith) ? 'compact' : 'full';

    const { data } = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey,
        outputsize,
      },
    });

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      return new Error('Invalid response from Alpha Vantage API');
    }

    const time = Date.now().toString();
    const stockData: TimeStreamStockPriceRecord[] =
      transformAlphaVintageStockTimeSeriesToTimestreamStockPriceRecords(timeSeries, symbol, time);

    return stockData;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return Promise.reject(error);
  }
}
