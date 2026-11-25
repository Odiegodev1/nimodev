-- CreateEnum
CREATE TYPE "NimoDeviceStatus" AS ENUM ('PENDING', 'ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "nimo_devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Meu NIMO',
    "hardwareId" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "userId" TEXT,
    "siteId" TEXT,
    "status" "NimoDeviceStatus" NOT NULL DEFAULT 'PENDING',
    "syncInterval" INTEGER NOT NULL DEFAULT 60,
    "firmwareVersion" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nimo_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nimo_pairing_codes" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nimo_pairing_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nimo_devices_hardwareId_key" ON "nimo_devices"("hardwareId");

-- CreateIndex
CREATE INDEX "nimo_devices_userId_idx" ON "nimo_devices"("userId");

-- CreateIndex
CREATE INDEX "nimo_devices_siteId_idx" ON "nimo_devices"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "nimo_pairing_codes_codeHash_key" ON "nimo_pairing_codes"("codeHash");

-- CreateIndex
CREATE INDEX "nimo_pairing_codes_deviceId_idx" ON "nimo_pairing_codes"("deviceId");

-- AddForeignKey
ALTER TABLE "nimo_devices" ADD CONSTRAINT "nimo_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nimo_devices" ADD CONSTRAINT "nimo_devices_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "monitored_sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nimo_pairing_codes" ADD CONSTRAINT "nimo_pairing_codes_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "nimo_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
