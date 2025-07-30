-- CreateTable
CREATE TABLE "CountryCurrency" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "conversionRate" DOUBLE PRECISION NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "targetCurrency" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryCurrency_country_key" ON "CountryCurrency"("country");
