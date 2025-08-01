/*
  Warnings:

  - You are about to drop the column `code` on the `MealPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `MealPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MealPlan_code_key";

-- AlterTable
ALTER TABLE "MealPlan" DROP COLUMN "code",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_name_key" ON "MealPlan"("name");
