/*
  Warnings:

  - Added the required column `contactFirstName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "contactFirstName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL;
