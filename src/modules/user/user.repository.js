const prisma = require('../../prisma'); 


async function createUser(userData) {
  return await prisma.user.create({
    data: userData,
  });
}


async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

async function updateUser(email, updateData) {
  return await prisma.user.update({
    where: { email },
    data: updateData,
  });
}

const createGuestUser = async (data) => {
  return prisma.user.create({
    data: {
      ...data,
      isGuest: true, 
    },
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  createGuestUser
};
