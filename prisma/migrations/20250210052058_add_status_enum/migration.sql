-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'WAITLISTED';

-- DropIndex
DROP INDEX "Booking_userId_eventId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "waitlistId" TEXT;
