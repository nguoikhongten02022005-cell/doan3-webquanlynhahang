-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('customer', 'staff', 'admin') NOT NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Table` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `areaId` ENUM('SANH_CHINH', 'PHONG_VIP', 'BAN_CONG', 'QUAY_BAR') NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` ENUM('AVAILABLE', 'HELD', 'OCCUPIED', 'DIRTY') NOT NULL,
    `activeBookingId` INTEGER NULL,
    `activeBookingCode` VARCHAR(191) NOT NULL DEFAULT '',
    `occupiedAt` DATETIME(3) NULL,
    `releasedAt` DATETIME(3) NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Table_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingCode` VARCHAR(191) NOT NULL,
    `guests` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `seatingArea` VARCHAR(191) NOT NULL DEFAULT 'KHONG_UU_TIEN',
    `notes` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `status` ENUM('YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'CHO_XAC_NHAN', 'DA_GHI_NHAN', 'DA_CHECK_IN', 'DA_XEP_BAN', 'TU_CHOI_HET_CHO', 'DA_HUY', 'KHONG_DEN', 'DA_HOAN_THANH') NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'web',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userEmail` VARCHAR(191) NULL,
    `occasion` VARCHAR(191) NOT NULL DEFAULT '',
    `confirmationChannel` JSON NULL,
    `internalNote` VARCHAR(191) NOT NULL DEFAULT '',
    `checkedInAt` DATETIME(3) NULL,
    `seatedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `noShowAt` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT '',
    `userId` INTEGER NULL,

    UNIQUE INDEX `Booking_bookingCode_key`(`bookingCode`),
    INDEX `Booking_userId_idx`(`userId`),
    INDEX `Booking_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingTable` (
    `bookingId` INTEGER NOT NULL,
    `tableId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`bookingId`, `tableId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItem` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NOT NULL DEFAULT 'Mới',
    `tone` VARCHAR(191) NOT NULL DEFAULT 'tone-amber',
    `image` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `serviceFee` DECIMAL(10, 2) NOT NULL,
    `discountAmount` DECIMAL(10, 2) NOT NULL,
    `voucherCode` VARCHAR(191) NOT NULL DEFAULT '',
    `total` DECIMAL(10, 2) NOT NULL,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'Mới Đặt',
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `tableNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'cash',
    `userEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `customerFullName` VARCHAR(191) NOT NULL DEFAULT '',
    `customerPhone` VARCHAR(191) NOT NULL DEFAULT '',
    `customerEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `customerAddress` VARCHAR(191) NOT NULL DEFAULT '',
    `customerSnapshot` JSON NULL,
    `userId` INTEGER NULL,

    INDEX `Order_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `menuItemId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `selectedSize` VARCHAR(191) NOT NULL DEFAULT 'M',
    `selectedToppings` JSON NULL,
    `specialNote` VARCHAR(191) NOT NULL DEFAULT '',
    `variantKey` VARCHAR(191) NOT NULL DEFAULT '',
    `itemSnapshot` JSON NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voucher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Voucher_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingTable` ADD CONSTRAINT `BookingTable_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingTable` ADD CONSTRAINT `BookingTable_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `Table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
