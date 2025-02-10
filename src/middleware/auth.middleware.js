const jwt = require("jsonwebtoken");
const { getSession } = require("../modules/auth/auth.repository");

const JWT_SECRET = process.env.JWT_SECRET;

function decodeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided. Please login." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = decodeToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ error: "Invalid token. Please login again." });
  }

  const session = await getSession(decoded.id);
  if (!session) {
    return res
      .status(401)
      .json({ error: "Session expired. Please login again." });
  }

  req.user = decoded;
  next();
}

module.exports = {
  decodeToken,
  authMiddleware
};
