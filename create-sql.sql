-- DROP DATABASE IF EXISTS `nelson_db`;

-- CREATE DATABASE IF NOT EXISTS `nelson_db`;

-- USE `nelson_db`;

-- DROP TABLE IF EXISTS `vaccination`;
DROP TABLE IF EXISTS `vaccination_history`;
DROP TABLE IF EXISTS `student`;
DROP TABLE IF EXISTS `school`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `configuration`;


CREATE TABLE `configuration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conf_key` varchar(255) DEFAULT NULL,
  `conf_value` varchar(255) DEFAULT NULL,
  `created_at` varchar(20) DEFAULT NULL,
  `updated_at` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_configuration_conf_key` (`conf_key`)
);

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `role_id` int NOT NULL DEFAULT '1',
  `created_at` varchar(20) DEFAULT NULL,
  `updated_at` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_user_email` (`email`)
);

CREATE TABLE `school` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `code` VARCHAR(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int DEFAULT NULL,
  `created_by_user_id` int NOT NULL,
  `created_at` varchar(20) DEFAULT NULL,
  `updated_at` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_school_email` (`email`),
  UNIQUE KEY `UK_school_code` (`code`),
  CONSTRAINT `school_user_FK` FOREIGN KEY (`created_by_user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school_id` INT NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `sex` Varchar(255) DEFAULT NULL,
  `date_of_birth` varchar(10) NOT NULL,
  `code` VARCHAR(255) NOT NULL,
  `number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int DEFAULT NULL,
  `created_by_user_id` int NOT NULL,
  `created_at` varchar(20) DEFAULT NULL,
  `updated_at` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
   UNIQUE KEY `UK_student_email` (`email`),
  UNIQUE KEY `UK_student_code` (`code`),
  CONSTRAINT `student_school_FK` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `vaccination_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `type` INT DEFAULT 0,
  `age` VARCHAR(255) NOT NULL,
  `vaccine` varchar(255) NOT NULL,
  `due_date` varchar(10) DEFAULT NULL,
  `given_date` varchar(10) DEFAULT NULL,
  `status` int DEFAULT 0,
  `remarks` text DEFAULT NULL, 
  `created_at` varchar(20) DEFAULT NULL,
  `updated_at` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `vaccination_history_student_FK` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT
	INTO
	`configuration` (`conf_key`,
	`conf_value`,
	`created_at`,
	`updated_at`)
VALUES 
("API_KEY", "test1234", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("API_LIMIT", "1000", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("API_RESET_TYPE", "1", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("API_RESET_VALUE", "1", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("API_CALL_REMAINING", "1000", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("LAST_API_LIMIT_UPDATE", "2024-01-08 00:00:00", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("LAST_SUCCESSFUL_API_CALL", "2024-01-08 00:00:00", "2024-01-08 00:00:00", "2024-01-08 00:00:00"),
("DELAY_BETWEEN_CALLS", "1000", "2024-01-08 00:00:00", "2024-01-08 00:00:00")
;

