/*
  Warnings:

  - A unique constraint covering the columns `[countryId,currencyCode]` on the table `CountryCurrency` will be added. If there are existing duplicate values, this will fail.
  - Made the column `countryId` on table `CountryCurrency` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CountryCurrency" DROP CONSTRAINT "CountryCurrency_countryId_fkey";

-- DropIndex
DROP INDEX "CountryCurrency_countryId_key";

-- AlterTable
ALTER TABLE "CountryCurrency" ALTER COLUMN "countryId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CountryCurrency_countryId_currencyCode_key" ON "CountryCurrency"("countryId", "currencyCode");

-- AddForeignKey
ALTER TABLE "CountryCurrency" ADD CONSTRAINT "CountryCurrency_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
