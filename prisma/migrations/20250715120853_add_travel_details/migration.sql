/*
  Warnings:

  - You are about to drop the column `items` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `departureCity` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureDate` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationCity` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelersCount` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('HOTEL', 'FLIGHT', 'TOUR', 'INSURANCE', 'OTHER');

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "items",
ADD COLUMN     "departureCity" TEXT NOT NULL,
ADD COLUMN     "departureDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "destinationCity" TEXT NOT NULL,
ADD COLUMN     "returnDate" TIMESTAMP(3),
ADD COLUMN     "travelersCount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ItineraryItem" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "quotationId" TEXT NOT NULL,

    CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" SERIAL NOT NULL,
    "type" "ServiceType" NOT NULL,
    "details" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "quotationId" TEXT NOT NULL,

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
