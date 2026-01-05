-- CreateTable
CREATE TABLE "QuotationFlight" (
    "id" SERIAL NOT NULL,
    "quotationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "QuotationFlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuotationFlight" ADD CONSTRAINT "QuotationFlight_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
