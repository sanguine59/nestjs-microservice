-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(55) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `passowrd` VARCHAR(55) NOT NULL,
    `country` VARCHAR(55) NOT NULL,
    `role` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
