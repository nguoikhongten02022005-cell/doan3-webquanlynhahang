/*
  Warnings:

  - You are about to alter the column `guests` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `areaId` on the `table` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the column `amount` on the `voucher` table. All the data in the column will be lost.
  - Added the required column `discountValue` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `guests` INTEGER NOT NULL;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_menuItemId_fkey`;

-- AlterTable
ALTER TABLE `menuitem` ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `table` MODIFY `areaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `voucher` DROP COLUMN `amount`,
    ADD COLUMN `discountType` ENUM('FIXED', 'PERCENTAGE') NOT NULL DEFAULT 'FIXED',
    ADD COLUMN `discountValue` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `endsAt` DATETIME(3) NULL,
    ADD COLUMN `maxDiscountAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `minOrderAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `startsAt` DATETIME(3) NULL,
    ADD COLUMN `usageLimit` INTEGER NULL,
    ADD COLUMN `usedCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_tokenHash_key`(`tokenHash`),
    INDEX `RefreshToken_userId_idx`(`userId`),
    INDEX `RefreshToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TableArea` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Booking_date_time_idx` ON `Booking`(`date`, `time`);

-- CreateIndex
CREATE INDEX `MenuItem_category_idx` ON `MenuItem`(`category`);

-- CreateIndex
CREATE INDEX `MenuItem_isAvailable_idx` ON `MenuItem`(`isAvailable`);

-- CreateIndex
CREATE INDEX `Order_status_idx` ON `Order`(`status`);

-- CreateIndex
CREATE INDEX `Order_orderDate_idx` ON `Order`(`orderDate`);

-- CreateIndex
CREATE INDEX `Table_areaId_idx` ON `Table`(`areaId`);

-- CreateIndex
CREATE INDEX `Table_status_idx` ON `Table`(`status`);

-- CreateIndex
CREATE INDEX `User_role_idx` ON `User`(`role`);

-- CreateIndex
CREATE INDEX `User_status_idx` ON `User`(`status`);

-- CreateIndex
CREATE INDEX `Voucher_isActive_idx` ON `Voucher`(`isActive`);

-- CreateIndex
CREATE INDEX `Voucher_startsAt_endsAt_idx` ON `Voucher`(`startsAt`, `endsAt`);

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Table` ADD CONSTRAINT `Table_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `TableArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
