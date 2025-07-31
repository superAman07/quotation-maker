/*
  Warnings:

  - You are about to drop the column `venueId` on the `Hotel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_venueId_fkey";

-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_destinationId_fkey";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "venueId",
ADD COLUMN     "countryId" INTEGER,
ADD COLUMN     "destinationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;
