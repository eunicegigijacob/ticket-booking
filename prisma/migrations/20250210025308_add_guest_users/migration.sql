/*
  Warnings:

  - You are about to drop the `_user_waiting_lists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `waiting_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_user_waiting_lists" DROP CONSTRAINT "_user_waiting_lists_A_fkey";

-- DropForeignKey
ALTER TABLE "_user_waiting_lists" DROP CONSTRAINT "_user_waiting_lists_B_fkey";

-- DropForeignKey
ALTER TABLE "waiting_list" DROP CONSTRAINT "waiting_list_eventId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "_user_waiting_lists";

-- DropTable
DROP TABLE "waiting_list";

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
