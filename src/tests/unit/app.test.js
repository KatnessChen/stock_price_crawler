const mockSend = jest.fn();
const mockTimestreamClient = {
  send: mockSend,
};

jest.mock("@aws-sdk/client-timestream-write", () => ({
  TimestreamWriteClient: jest.fn(() => mockTimestreamClient),
  WriteRecordsCommand: jest.fn(),
}));

describe("Lambda Handler Tests", () => {
  let handler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    handler = require("../../app").handler;
  });

  it("should successfully write stock data to Timestream", async () => {
    // Arrange
    const mockEvent = {
      httpMethod: "GET",
      path: "/hello",
    };

    const mockTimestreamResponse = {
      ResponseMetadata: { RequestId: "test-request-id" },
    };

    mockSend.mockResolvedValueOnce(mockTimestreamResponse);

    // Act
    const response = await handler(mockEvent);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(response.body).toBe("Success");
  });

  it("should handle Timestream write errors", async () => {
    // Arrange
    const mockEvent = {
      httpMethod: "GET",
      path: "/hello",
    };

    const mockError = new Error("Timestream write failed");
    mockSend.mockRejectedValueOnce(mockError);

    // Act
    const response = await handler(mockEvent);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toContain("Timestream write failed");
  });
});
