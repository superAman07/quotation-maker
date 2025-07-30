/*
  Warnings:

  - A unique constraint covering the columns `[countryId]` on the table `CountryCurrency` will be added. If there are existing duplicate values, this will fail.
  - Made the column `countryId` on table `CountryCurrency` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CountryCurrency" DROP CONSTRAINT "CountryCurrency_countryId_fkey";

-- AlterTable
ALTER TABLE "CountryCurrency" ALTER COLUMN "countryId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CountryCurrency_countryId_key" ON "CountryCurrency"("countryId");

-- AddForeignKey
ALTER TABLE "CountryCurrency" ADD CONSTRAINT "CountryCurrency_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
