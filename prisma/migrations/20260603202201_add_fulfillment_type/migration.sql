-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('READY', 'MADE_TO_ORDER', 'PRE_ORDER');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "fulfillmentType" "FulfillmentType" NOT NULL DEFAULT 'READY',
ADD COLUMN     "productionDays" INTEGER;

-- AlterTable
ALTER TABLE "variants" ADD COLUMN     "fulfillmentType" "FulfillmentType",
ADD COLUMN     "productionDays" INTEGER;
