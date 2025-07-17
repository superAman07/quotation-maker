/*
  Warnings:

  - You are about to drop the column `cost` on the `ItineraryItem` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `ItineraryItem` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `ItineraryItem` table. All the data in the column will be lost.
  - You are about to drop the column `clientAddress` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `departureCity` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `departureDate` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `destinationCity` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `returnDate` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `travelersCount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `ServiceItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dayTitle` to the `ItineraryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupSize` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelDate` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServiceItem" DROP CONSTRAINT "ServiceItem_quotationId_fkey";

-- AlterTable
ALTER TABLE "ItineraryItem" DROP COLUMN "cost",
DROP COLUMN "date",
DROP COLUMN "day",
ADD COLUMN     "dayTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "clientAddress",
DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "departureCity",
DROP COLUMN "departureDate",
DROP COLUMN "destinationCity",
DROP COLUMN "discount",
DROP COLUMN "returnDate",
DROP COLUMN "subtotal",
DROP COLUMN "tax",
DROP COLUMN "total",
DROP COLUMN "travelersCount",
ADD COLUMN     "flightCost" DOUBLE PRECISION,
ADD COLUMN     "flightImageUrl" TEXT,
ADD COLUMN     "groupSize" INTEGER NOT NULL,
ADD COLUMN     "landCostPerHead" DOUBLE PRECISION,
ADD COLUMN     "mealPlan" TEXT,
ADD COLUMN     "totalGroupCost" DOUBLE PRECISION,
ADD COLUMN     "totalPerHead" DOUBLE PRECISION,
ADD COLUMN     "travelDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicleUsed" TEXT;

-- DropTable
DROP TABLE "ServiceItem";

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "hotelName" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "quotationId" TEXT NOT NULL,

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inclusion" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,

    CONSTRAINT "Inclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exclusion" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,

    CONSTRAINT "Exclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inclusion" ADD CONSTRAINT "Inclusion_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exclusion" ADD CONSTRAINT "Exclusion_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
