-- CreateEnum
CREATE TYPE "DetailType" AS ENUM ('KEY_VALUE', 'RICH_TEXT');

-- CreateTable
CREATE TABLE "product_details" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "group" TEXT,
    "type" "DetailType" NOT NULL DEFAULT 'KEY_VALUE',
    "key" TEXT,
    "value" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
