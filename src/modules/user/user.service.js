
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

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};
