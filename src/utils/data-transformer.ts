import { TimeStreamStockPriceRecord, AlphaVantageTimeSeriesType } from '../types/base';

export function transformAlphaVintageStockTimeSeriesToTimestreamStockPriceRecords(
  timeSeries: AlphaVantageTimeSeriesType,
  symbol: string,
  time: string = Date.now().toString()
): TimeStreamStockPriceRecord[] {
  return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
    Dimensions: [{ Name: 'Symbol', Value: symbol }],
    MeasureName: 'StockPrice',
    MeasureValues: [
      { Name: 'Open', Value: values['1. open'], Type: 'DOUBLE' },
      { Name: 'High', Value: values['2. high'], Type: 'DOUBLE' },
      { Name: 'Low', Value: values['3. low'], Type: 'DOUBLE' },
      { Name: 'Close', Value: values['4. close'], Type: 'DOUBLE' },
      { Name: 'Volume', Value: values['5. volume'], Type: 'DOUBLE' },
      { Name: 'Date', Value: date, Type: 'VARCHAR' },
    ],
    MeasureValueType: 'MULTI',
    Time: time,
    TimeUnit: 'MILLISECONDS',
  }));
}
