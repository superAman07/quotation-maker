-- DropForeignKey
ALTER TABLE "CountryCurrency" DROP CONSTRAINT "CountryCurrency_countryId_fkey";

-- AlterTable
ALTER TABLE "CountryCurrency" ALTER COLUMN "countryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CountryCurrency" ADD CONSTRAINT "CountryCurrency_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
