-- CreateEnum
CREATE TYPE "NimoTheme" AS ENUM ('ORIGINAL', 'OCEAN', 'LAVENDER', 'SUNSET', 'ROSE', 'ICE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nimoTheme" "NimoTheme" NOT NULL DEFAULT 'ORIGINAL';
