
const userRepository = require("./user.repository");


async function createUser(userData) {
  return await userRepository.createUser(userData);
}

async function findUserByEmail(email) {
  return await userRepository.findUserByEmail(email);
}

async function findUserById(id) {
  return await userRepository.findUserById(id);
}

async function updateUser(email, updateData) {
  return await userRepository.updateUser(email, updateData);
}

const createGuestUser = async (guestData) => {
 
  if(!guestData) {
    throw new Error("guestData is required to create guest user");
  }
  user = await userRepository.createGuestUser(guestData);
  

  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  createGuestUser
};
