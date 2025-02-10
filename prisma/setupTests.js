const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

beforeEach(async () => {
  console.log("🧹 Resetting database before test...");

  
  await prisma.$transaction([
    prisma.booking.deleteMany(),
    prisma.waitlist.deleteMany(),
    prisma.event.deleteMany(),
    prisma.user.deleteMany(), 
  ]);
});

afterAll(async () => {
  console.log("🔌 Disconnecting Prisma...");
  await prisma.$disconnect();
});

module.exports = prisma;
