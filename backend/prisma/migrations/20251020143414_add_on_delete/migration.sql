-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `quote_userId_fkey`;

-- DropIndex
DROP INDEX `quote_userId_fkey` ON `quote`;

-- AddForeignKey
ALTER TABLE `quote` ADD CONSTRAINT `quote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
