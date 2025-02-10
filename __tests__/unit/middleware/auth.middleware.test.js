const jwt = require("jsonwebtoken");
const { getSession } = require("../../../src/modules/auth/auth.repository");
const {
  authMiddleware,
  decodeToken,
} = require("../../../src/middleware/auth.middleware");

jest.mock("jsonwebtoken");
jest.mock("../../../src/modules/auth/auth.repository");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should return 401 if no authorization header is provided", async () => {
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "No token provided. Please login.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if the authorization header does not start with 'Bearer '", async () => {
    req.headers.authorization = "InvalidToken";
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "No token provided. Please login.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalid_token";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid token. Please login again.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if session does not exist", async () => {
    req.headers.authorization = "Bearer valid_token";
    jwt.verify.mockReturnValue({ id: "user123" });
    getSession.mockResolvedValue(null);

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Session expired. Please login again.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next() and attach user to req if token is valid and session exists", async () => {
    req.headers.authorization = "Bearer valid_token";
    const decodedUser = { id: "user123" };
    jwt.verify.mockReturnValue(decodedUser);
    getSession.mockResolvedValue({ userId: "user123" });

    await authMiddleware(req, res, next);
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("decodeToken", () => {
  test("should return decoded token if valid", () => {
    jwt.verify.mockReturnValue({ id: "user123" });
    const result = decodeToken("valid_token");
    expect(result).toEqual({ id: "user123" });
  });

  test("should return null if token is invalid", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const result = decodeToken("invalid_token");
    expect(result).toBeNull();
  });
});
