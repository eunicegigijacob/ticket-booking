const { z } = require("zod");
const errorHandler = require("../../../src/middleware/error.middleware")

describe("Error Handler Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
   
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Zod Validation Error Handling", () => {
    it("should handle Zod validation errors with formatted error messages", () => {

      const zodError = new z.ZodError([
        {
          path: ["username"],
          message: "Username must be at least 3 characters long",
          code: "too_small",
        },
        {
          path: ["email"],
          message: "Invalid email format",
          code: "invalid_string",
        },
      ]);

     
      errorHandler(zodError, mockReq, mockRes, mockNext);

    
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [
          {
            field: "username",
            message: "Username must be at least 3 characters long",
          },
          {
            field: "email",
            message: "Invalid email format",
          },
        ],
      });
    });

    it("should handle Zod validation errors with empty path", () => {
     
      const zodError = new z.ZodError([
        {
          path: [],
          message: "Validation failed",
          code: "invalid_type",
        },
      ]);

     
      errorHandler(zodError, mockReq, mockRes, mockNext);

     
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [
          {
            field: undefined,
            message: "Validation failed",
          },
        ],
      });
    });
  });

  describe("Generic Error Handling", () => {
    it("should handle custom errors with specific status code", () => {
 
      const customError = new Error("Resource not found");
      customError.statusCode = 404;
      customError.details = { resourceType: "User" };

     
      errorHandler(customError, mockReq, mockRes, mockNext);

   
      expect(console.error).toHaveBeenCalledWith("[ERROR] Resource not found");
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Resource not found",
        details: { resourceType: "User" },
      });
    });

    it("should handle generic errors with default 500 status code", () => {
     
      const genericError = new Error("Unexpected error occurred");

     
      errorHandler(genericError, mockReq, mockRes, mockNext);

  
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] Unexpected error occurred"
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Unexpected error occurred",
        details: null,
      });
    });

    it("should handle errors without a message", () => {
     
      const errorWithoutMessage = new Error();

     
      errorHandler(errorWithoutMessage, mockReq, mockRes, mockNext);

      
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] "
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
        details: null,
      });
    });
  });

  describe("Error Logging", () => {
    it("should log errors with correct format", () => {
    
      const consoleErrorSpy = jest.spyOn(console, "error");
      const testError = new Error("Test logging error");
      testError.statusCode = 400;

     
      errorHandler(testError, mockReq, mockRes, mockNext);

  
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR] Test logging error"
      );
    });
  });
});
