const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require('../user/user.service')
const { createSession, createRefreshSession, deleteSession } = require("./auth.repository");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_SECRET || "default_secret";


async function signup(userData) {
  const existingUser = await userService.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User already exists, login or reset your password");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await userService.createUser({
    ...userData,
    password: hashedPassword,
  });
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

async function createAuthTokens(payload) {

 const accessToken =  jwt.sign(payload, JWT_SECRET, {expiresIn: '1hr'});

 const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
  expiresIn: "1d", 
  });

  return {
    accessToken,
    refreshToken,
  };
   
}


const login = async (email, password) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Create authentication tokens
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const {refreshToken, accessToken} = await createAuthTokens(jwtPayload);

  // Create user session and refresh session
  const sessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  await createSession(user.id, sessionPayload);
  await createRefreshSession(user.id, sessionPayload);

   const { password: userPassword, ...userWithoutPassword } = user;

  return {
    status: true,
    message: "User successfully logged in",
    data: {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  };
};

const logout = async (userId) => {
    await deleteSession(userId);

   return {
     status: true,
     message: "User successfully logged out",
     data: {},
   };
};


async function resetPassword(email, newPassword) {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const data = {
    password: hashedPassword
  }
  await userService.updateUser(email, data);
  return {
    status: true,
    message: "Password reset successful",
    data: {},
  };
}



module.exports = {
  login,
  logout,
  resetPassword,
  signup,
};

