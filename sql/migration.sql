-- CreateTable
CREATE TABLE "PlaidItem" (
    "id" SERIAL NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accesstoken" TEXT NOT NULL,
    "ownedBy" INTEGER,

    CONSTRAINT "PlaidItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "plaidAcc" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "PlaidItem" ADD CONSTRAINT "PlaidItem_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

