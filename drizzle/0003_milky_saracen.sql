CREATE TABLE `email_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`source` varchar(64) NOT NULL DEFAULT 'oracle',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_leads_email_unique` UNIQUE(`email`)
);
