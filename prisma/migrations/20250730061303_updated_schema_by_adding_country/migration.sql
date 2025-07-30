/*
  Warnings:

  - You are about to drop the column `country` on the `CountryCurrency` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Destination` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CountryCurrency_country_key";

-- AlterTable
ALTER TABLE "CountryCurrency" DROP COLUMN "country",
ADD COLUMN     "countryId" INTEGER;

-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "country",
ADD COLUMN     "countryId" INTEGER;

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryCurrency" ADD CONSTRAINT "CountryCurrency_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
