/*
  Warnings:

  - You are about to drop the column `flightRouteId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `FlightRoute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_flightRouteId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_intercityVehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_localVehicleId_fkey";

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "flightRouteId",
ADD COLUMN     "flightRoute" TEXT;

-- DropTable
DROP TABLE "FlightRoute";

-- DropTable
DROP TABLE "VehicleType";

-- DropEnum
DROP TYPE "VehicleCategory";

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "priceInINR" DOUBLE PRECISION NOT NULL,
    "countryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_intercityVehicleId_fkey" FOREIGN KEY ("intercityVehicleId") REFERENCES "Transfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_localVehicleId_fkey" FOREIGN KEY ("localVehicleId") REFERENCES "Transfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
