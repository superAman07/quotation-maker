/*
  Warnings:

  - You are about to drop the column `venueId` on the `Accommodation` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the `Venue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Accommodation" DROP CONSTRAINT "Accommodation_venueId_fkey";

-- AlterTable
ALTER TABLE "Accommodation" DROP COLUMN "venueId";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "imageUrl",
ADD COLUMN     "mealPlan" TEXT,
ADD COLUMN     "source" TEXT;

-- DropTable
DROP TABLE "Venue";
