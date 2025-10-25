CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('Admin','Penulis') DEFAULT 'Penulis',
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `kategori` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	CONSTRAINT `kategori_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kategori_id` int NOT NULL,
	`quote` text NOT NULL,
	`author` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `quote_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_token` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` datetime DEFAULT '2025-10-25 02:01:25.185',
	CONSTRAINT `refresh_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `refresh_token_token_unique` UNIQUE(`token`)
);
