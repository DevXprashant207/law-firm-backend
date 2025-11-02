-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SUBADMIN');

-- AlterTable
ALTER TABLE "public"."admins" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "public"."subadmins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "canManageEnquiries" BOOLEAN NOT NULL DEFAULT false,
    "canManageLawyers" BOOLEAN NOT NULL DEFAULT false,
    "canManageServices" BOOLEAN NOT NULL DEFAULT false,
    "canManagePosts" BOOLEAN NOT NULL DEFAULT false,
    "canManageNews" BOOLEAN NOT NULL DEFAULT false,
    "canManageSettings" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subadmins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subadmins_email_key" ON "public"."subadmins"("email");
