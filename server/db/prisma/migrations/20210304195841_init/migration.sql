-- CreateTable
CREATE TABLE "PlaidItem" (
    "id" SERIAL NOT NULL,
    "accesstoken" TEXT NOT NULL,
    "ownedBy" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlaidItem" ADD FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
