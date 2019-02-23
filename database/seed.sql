CREATE DATABASE IF NOT EXISTS agri_thesis;

ALTER DATABASE agri_thesis CHARACTER SET utf32 COLLATE utf32_general_ci;

USE agri_thesis;

CREATE TABLE roles (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `created` DATETIME DEFAULT NULL,
  `updated` DATETIME DEFAULT NULL,
  `deleted` DATETIME DEFAULT NULL
);

CREATE TABLE users (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `role_id` VARCHAR(64) NULL,
  `first_name` VARCHAR(50)  NOT NULL,
  `last_name` VARCHAR(50)  NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50)  NOT NULL,
  `password` VARCHAR(64)  NOT NULL,
  `phone_number` VARCHAR(11)  NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL
);

ALTER TABLE users ADD CONSTRAINT FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`);

CREATE TABLE tokens (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `token` LONGTEXT NOT NULL,
  `created` DATETIME DEFAULT NULL
);

ALTER TABLE users ADD COLUMN deleted DATETIME DEFAULT null;
#updated 02-23-2019


CREATE TABLE products (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(256) NULL,
  `description` LONGTEXT  NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `quantity` INT DEFAULT 1 NOT NULL,
  `price`  FLOAT NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);

ALTER TABLE users ADD COLUMN `address` LONGTEXT NOT NULL;
