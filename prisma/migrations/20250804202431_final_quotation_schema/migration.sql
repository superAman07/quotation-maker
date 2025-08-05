/*
  Warnings:

  - You are about to drop the column `flightCost` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `intercityVehicleId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `landCostPerHead` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `localVehicleId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `localVehicleUsed` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `mealPlan` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `totalPerHead` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleUsed` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `Accommodation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exclusion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExclusionTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inclusion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InclusionTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItineraryItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Accommodation" DROP CONSTRAINT "Accommodation_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "Accommodation" DROP CONSTRAINT "Accommodation_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "Exclusion" DROP CONSTRAINT "Exclusion_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "Exclusion" DROP CONSTRAINT "Exclusion_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Inclusion" DROP CONSTRAINT "Inclusion_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "Inclusion" DROP CONSTRAINT "Inclusion_templateId_fkey";

-- DropForeignKey
ALTER TABLE "ItineraryItem" DROP CONSTRAINT "ItineraryItem_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_intercityVehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_localVehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_mealPlanId_fkey";

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "flightCost",
DROP COLUMN "intercityVehicleId",
DROP COLUMN "landCostPerHead",
DROP COLUMN "localVehicleId",
DROP COLUMN "localVehicleUsed",
DROP COLUMN "mealPlan",
DROP COLUMN "place",
DROP COLUMN "totalPerHead",
DROP COLUMN "vehicleUsed",
ADD COLUMN     "destinationName" TEXT,
ADD COLUMN     "flightCostPerPerson" DOUBLE PRECISION,
ADD COLUMN     "landCostPerPerson" DOUBLE PRECISION,
ADD COLUMN     "mealPlanName" TEXT,
ADD COLUMN     "totalCostPerPerson" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Accommodation";

-- DropTable
DROP TABLE "Exclusion";

-- DropTable
DROP TABLE "ExclusionTemplate";

-- DropTable
DROP TABLE "Inclusion";

-- DropTable
DROP TABLE "InclusionTemplate";

-- DropTable
DROP TABLE "ItineraryItem";

-- CreateTable
CREATE TABLE "QuotationAccommodation" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hotelName" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuotationAccommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationTransfer" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuotationTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItinerary" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "dayTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "QuotationItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationInclusion" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "item" TEXT NOT NULL,

    CONSTRAINT "QuotationInclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationExclusion" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "item" TEXT NOT NULL,

    CONSTRAINT "QuotationExclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuotationAccommodation" ADD CONSTRAINT "QuotationAccommodation_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationTransfer" ADD CONSTRAINT "QuotationTransfer_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItinerary" ADD CONSTRAINT "QuotationItinerary_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationInclusion" ADD CONSTRAINT "QuotationInclusion_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationExclusion" ADD CONSTRAINT "QuotationExclusion_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
