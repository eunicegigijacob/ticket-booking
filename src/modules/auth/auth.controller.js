const authService = require("./auth.services");

/**
 * Handles user signup.
 */
async function signup(req, res, next) {
  try {
    const userData = req.body;
    const user = await authService.signup(userData);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user login.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user logout.
 */
async function logout(req, res, next) {
  try {
    const result = await authService.logout();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles password reset.
 */
async function resetPassword(req, res, next) {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  logout,
  resetPassword,
};
