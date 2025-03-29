require("dotenv").config();

const {
  TimestreamWriteClient,
  WriteRecordsCommand,
} = require("@aws-sdk/client-timestream-write");

const timestreamClient = new TimestreamWriteClient({
  region: process.env.AWS_REGION || "us-east-1",
});

exports.handler = async (event) => {
  const params = {
    DatabaseName: process.env.TIMESTREAM_DATABASE_NAME,
    TableName: process.env.TIMESTREAM_TABLE_NAME,
    Records: [
      {
        Dimensions: [{ Name: "stock_symbol", Value: "TEST" }],
        MeasureName: "stock_metrics",
        MeasureValues: [
          { Name: "open", Value: "150.25", Type: "DOUBLE" },
          { Name: "close", Value: "152.10", Type: "DOUBLE" },
        ],
        MeasureValueType: "MULTI",
        Time: `${Date.now()}`,
        TimeUnit: "MILLISECONDS",
      },
    ],
  };

  try {
    const command = new WriteRecordsCommand(params);
    const result = await timestreamClient.send(command);
    console.log("Data written successfully:", result);
    return { statusCode: 200, body: "Success" };
  } catch (error) {
    console.error("Error writing to Timestream:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Timestream write failed",
        error: error.message,
      }),
    };
  }
};
