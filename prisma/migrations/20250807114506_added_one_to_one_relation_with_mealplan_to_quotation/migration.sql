-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
