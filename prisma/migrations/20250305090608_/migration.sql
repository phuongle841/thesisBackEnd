/*
  Warnings:

  - You are about to drop the column `productRelatedId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productRelatedId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productRelatedId";

-- CreateTable
CREATE TABLE "Order" (
    "orderId" SERIAL NOT NULL,
    "productProductId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productProductId_fkey" FOREIGN KEY ("productProductId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
