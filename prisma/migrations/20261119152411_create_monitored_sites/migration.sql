-- CreateEnum
CREATE TYPE "MonitorStatus" AS ENUM ('UNKNOWN', 'ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "monitored_sites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" "MonitorStatus" NOT NULL DEFAULT 'UNKNOWN',
    "httpStatus" INTEGER,
    "responseTime" INTEGER,
    "visitorsOnline" INTEGER,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitored_sites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monitored_sites_user_id_idx" ON "monitored_sites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "monitored_sites_user_id_url_key" ON "monitored_sites"("user_id", "url");

-- AddForeignKey
ALTER TABLE "monitored_sites" ADD CONSTRAINT "monitored_sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
