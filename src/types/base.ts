import { DateString } from '../utils/date';

export type TimeStreamStockPriceRecord = {
  Dimensions: { Name: string; Value: string }[];
  MeasureName: string;
  MeasureValues: { Name: string; Value: string; Type: 'DOUBLE' | 'VARCHAR' }[];
  MeasureValueType: 'MULTI';
  Time: string;
  TimeUnit: 'MILLISECONDS';
};

type AlphaVantageStockPriceType = {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
};

export type AlphaVantageTimeSeriesType = Record<DateString, AlphaVantageStockPriceType>;
