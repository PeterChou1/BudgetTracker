/*
  Warnings:

  - Added the required column `itemId` to the `PlaidItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaidItem" ADD COLUMN     "itemId" TEXT NOT NULL;
