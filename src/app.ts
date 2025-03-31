require('dotenv').config();

import { TimestreamWriteClient, WriteRecordsCommand } from '@aws-sdk/client-timestream-write';

import { TimeStreamStockPriceRecord } from './types/base';

import { getStockPrice } from './utils/get-stock-price';

const timestreamClient = new TimestreamWriteClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

interface Response {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

type WriteRecordsParams = {
  DatabaseName: string | undefined;
  TableName: string | undefined;
  Records: TimeStreamStockPriceRecord[];
};

export const handler = async (): Promise<Response> => {
  const records = await getStockPrice('TSM', '2025-03-25'); // TODO: replace with actual symbol and date

  if (!records || !Array.isArray(records)) {
    throw new Error('No stock price records found');
  }

  const params: WriteRecordsParams = {
    DatabaseName: process.env.TIMESTREAM_DATABASE_NAME,
    TableName: process.env.TIMESTREAM_TABLE_NAME,
    Records: records.slice(0, 1), // TODO: replace with actual records
  };

  try {
    const command = new WriteRecordsCommand(params);
    await timestreamClient.send(command);
    return { statusCode: 200, body: 'Success' };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Timestream write failed',
        error: error,
      }),
    };
  }
};
