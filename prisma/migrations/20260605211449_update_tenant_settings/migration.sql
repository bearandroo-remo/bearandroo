/*
  Warnings:

  - You are about to drop the column `primaryColor` on the `tenant_settings` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `tenant_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenant_settings" DROP COLUMN "primaryColor",
DROP COLUMN "secondaryColor",
ADD COLUMN     "borderRadius" TEXT DEFAULT '8px',
ADD COLUMN     "colorAccent" TEXT DEFAULT '#C4956A',
ADD COLUMN     "colorBackground" TEXT DEFAULT '#FAFAF8',
ADD COLUMN     "colorPrimary" TEXT DEFAULT '#8B6914',
ADD COLUMN     "colorSecondary" TEXT DEFAULT '#F5EFE6',
ADD COLUMN     "colorText" TEXT DEFAULT '#2C2C2C',
ADD COLUMN     "fontFamily" TEXT DEFAULT 'Inter';
