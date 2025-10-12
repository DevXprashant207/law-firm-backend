-- AlterTable
ALTER TABLE "public"."enquiries" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."services" ADD COLUMN     "imageUrl" TEXT;
