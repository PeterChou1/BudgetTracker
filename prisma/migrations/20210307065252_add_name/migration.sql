/*
  Warnings:

  - Added the required column `name` to the `PlaidItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaidItem" ADD COLUMN     "name" TEXT NOT NULL;
