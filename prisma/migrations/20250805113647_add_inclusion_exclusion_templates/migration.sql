-- CreateTable
CREATE TABLE "InclusionTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "InclusionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExclusionTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ExclusionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InclusionTemplate_name_key" ON "InclusionTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExclusionTemplate_name_key" ON "ExclusionTemplate"("name");
