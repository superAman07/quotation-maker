-- DropForeignKey
ALTER TABLE "QuotationFlight" DROP CONSTRAINT "QuotationFlight_quotationId_fkey";

-- AddForeignKey
ALTER TABLE "QuotationFlight" ADD CONSTRAINT "QuotationFlight_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
