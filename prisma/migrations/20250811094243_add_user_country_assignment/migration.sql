-- CreateTable
CREATE TABLE "UserCountryAssignment" (
    "userId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCountryAssignment_pkey" PRIMARY KEY ("userId","countryId")
);

-- AddForeignKey
ALTER TABLE "UserCountryAssignment" ADD CONSTRAINT "UserCountryAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCountryAssignment" ADD CONSTRAINT "UserCountryAssignment_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
