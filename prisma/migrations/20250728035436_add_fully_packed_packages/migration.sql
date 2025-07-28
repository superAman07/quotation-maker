-- CreateTable
CREATE TABLE "FullyPackedPackage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "destinationId" INTEGER NOT NULL,
    "mealPlan" TEXT,
    "vehicleUsed" TEXT,
    "localVehicleUsed" TEXT,
    "flightCostPerPerson" DOUBLE PRECISION,
    "landCostPerPerson" DOUBLE PRECISION,
    "totalNights" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FullyPackedPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FullyPackedPackageAccommodation" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "hotelName" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "FullyPackedPackageAccommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FullyPackedPackageItinerary" (
    "id" SERIAL NOT NULL,
    "dayTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "FullyPackedPackageItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FullyPackedPackageInclusion" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "FullyPackedPackageInclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FullyPackedPackageExclusion" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "FullyPackedPackageExclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FullyPackedPackage" ADD CONSTRAINT "FullyPackedPackage_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullyPackedPackageAccommodation" ADD CONSTRAINT "FullyPackedPackageAccommodation_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "FullyPackedPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullyPackedPackageItinerary" ADD CONSTRAINT "FullyPackedPackageItinerary_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "FullyPackedPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullyPackedPackageInclusion" ADD CONSTRAINT "FullyPackedPackageInclusion_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "FullyPackedPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullyPackedPackageExclusion" ADD CONSTRAINT "FullyPackedPackageExclusion_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "FullyPackedPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
