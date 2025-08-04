/*
  Warnings:

  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FullyPackedPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FullyPackedPackageAccommodation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FullyPackedPackageExclusion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FullyPackedPackageInclusion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FullyPackedPackageItinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tax` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FullyPackedPackage" DROP CONSTRAINT "FullyPackedPackage_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "FullyPackedPackageAccommodation" DROP CONSTRAINT "FullyPackedPackageAccommodation_packageId_fkey";

-- DropForeignKey
ALTER TABLE "FullyPackedPackageExclusion" DROP CONSTRAINT "FullyPackedPackageExclusion_packageId_fkey";

-- DropForeignKey
ALTER TABLE "FullyPackedPackageInclusion" DROP CONSTRAINT "FullyPackedPackageInclusion_packageId_fkey";

-- DropForeignKey
ALTER TABLE "FullyPackedPackageItinerary" DROP CONSTRAINT "FullyPackedPackageItinerary_packageId_fkey";

-- DropTable
DROP TABLE "Discount";

-- DropTable
DROP TABLE "FullyPackedPackage";

-- DropTable
DROP TABLE "FullyPackedPackageAccommodation";

-- DropTable
DROP TABLE "FullyPackedPackageExclusion";

-- DropTable
DROP TABLE "FullyPackedPackageInclusion";

-- DropTable
DROP TABLE "FullyPackedPackageItinerary";

-- DropTable
DROP TABLE "Tax";
