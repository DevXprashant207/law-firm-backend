/*
  Warnings:

  - You are about to drop the column `name` on the `enquiries` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `enquiries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `enquiries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lawId` to the `enquiries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `enquiries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."enquiries" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "lawId" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);
