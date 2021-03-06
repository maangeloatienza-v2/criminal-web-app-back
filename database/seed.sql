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


CREATE TABLE orders (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(10) NOT NULL,
  `product_name` VARCHAR(256) NULL,
  `quantity` INT NOT NULL,
  `item_price` FLOAT NOT NULL,
  `total_item` FLOAT NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);
#updated 02-24-2019


ALTER TABLE products DROP COLUMN quantity;

#updated 02-24-2019

ALTER TABLE orders ADD COLUMN order_by VARCHAR(64) NOT NULL;

#updated 02-24-2019


CREATE TABLE feedbacks (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `description` LONGTEXT NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);
#updated 02-24-2019


CREATE TABLE schedule_activity (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `description` LONGTEXT NOT NULL,
  `scheduled_date` DATETIME  NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);


ALTER TABLE schedule_activity
ADD COLUMN cancelled DATETIME DEFAULT null,
ADD COLUMN completed DATETIME DEFAULT null;
#updated 03-03-2019

ALTER TABLE schedule_activity
ADD COLUMN name VARCHAR(256) not null,
ADD COLUMN staff VARCHAR(256) DEFAULT null;
#updated 03-03-2019


CREATE TABLE reports (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `activity_id` VARCHAR(64) NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);


CREATE TABLE reports_item_list (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `report_id` VARCHAR(64) NOT NULL,
  `fw_test` FLOAT NULL,
  `bw_test` FLOAT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);


ALTER TABLE reports_item_list
ADD COLUMN code VARCHAR(20) NOT NULL;

ALTER TABLE reports
MODIFY COLUMN description LONGTEXT NULL;
#updated 03-08-2019


ALTER TABLE products
ADD COLUMN file VARCHAR(256) NULL;


ALTER TABLE schedule_activity
ADD COLUMN staff_id VARCHAR(64) NOT NULL;

ALTER TABLE schedule_activity
ADD CONSTRAINT `schedule_activity_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`); 

CREATE TABLE order_v2 (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `customer_id` VARCHAR(64) NOT NULL,
  `message` LONGTEXT NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);


ALTER TABLE order_v2
ADD COLUMN is_read BOOLEAN DEFAULT false;

ALTER TABLE order_v2
ADD COLUMN is_completed BOOLEAN DEFAULT false;

ALTER TABLE orders
ADD COLUMN product_id VARCHAR(64) NOT NULL;

ALTER TABLE orders
ADD COLUMN is_read BOOLEAN DEFAULT false;

ALTER TABLE orders
ADD COLUMN is_completed BOOLEAN DEFAULT false;

ALTER TABLE orders
ADD COLUMN is_cancelled BOOLEAN DEFAULT false;

