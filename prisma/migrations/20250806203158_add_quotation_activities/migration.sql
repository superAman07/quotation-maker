/*
  Warnings:

  - You are about to drop the column `destinationId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `destinationName` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `flightRoute` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `mealPlanName` on the `Quotation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_destinationId_fkey";

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "destinationId",
DROP COLUMN "destinationName",
DROP COLUMN "flightRoute",
DROP COLUMN "mealPlanName";

-- CreateTable
CREATE TABLE "QuotationActivity" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transfer" TEXT,
    "adultPrice" DOUBLE PRECISION NOT NULL,
    "childPrice" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuotationActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuotationActivity" ADD CONSTRAINT "QuotationActivity_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
