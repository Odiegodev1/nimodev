-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('SITE_DOWN', 'HTTP_404', 'HTTP_500', 'HTTP_502', 'HTTP_503', 'HTTP_504', 'HTTP_OTHER', 'TIMEOUT', 'CONNECTION_ERROR', 'SSL_ERROR');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AlertSource" AS ENUM ('UPTIME_MONITOR', 'TRACKING_SCRIPT', 'SERVER_INTEGRATION');

-- AlterTable
ALTER TABLE "monitored_sites" ADD COLUMN     "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastOfflineAt" TIMESTAMP(3),
ADD COLUMN     "lastOnlineAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "source" "AlertSource" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT,
    "statusCode" INTEGER,
    "responseTime" INTEGER,
    "method" TEXT,
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "readAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alerts_siteId_status_idx" ON "alerts"("siteId", "status");

-- CreateIndex
CREATE INDEX "alerts_siteId_type_status_idx" ON "alerts"("siteId", "type", "status");

-- CreateIndex
CREATE INDEX "alerts_siteId_readAt_idx" ON "alerts"("siteId", "readAt");

-- CreateIndex
CREATE INDEX "alerts_siteId_type_path_idx" ON "alerts"("siteId", "type", "path");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "alerts_createdAt_idx" ON "alerts"("createdAt");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "monitored_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
