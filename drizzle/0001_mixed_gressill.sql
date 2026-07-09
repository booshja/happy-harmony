PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`displayId` text NOT NULL,
	`userId` text NOT NULL,
	`categoryId` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activity`("id", "displayId", "userId", "categoryId", "name", "description", "duration", "createdAt", "updatedAt") SELECT "id", "displayId", "userId", "categoryId", "name", "description", "duration", "createdAt", "updatedAt" FROM `activity`;--> statement-breakpoint
DROP TABLE `activity`;--> statement-breakpoint
ALTER TABLE `__new_activity` RENAME TO `activity`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `activity_displayId_unique` ON `activity` (`displayId`);--> statement-breakpoint
CREATE TABLE `__new_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`displayId` text NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_category`("id", "displayId", "userId", "name", "description", "createdAt", "updatedAt") SELECT "id", "displayId", "userId", "name", "description", "createdAt", "updatedAt" FROM `category`;--> statement-breakpoint
DROP TABLE `category`;--> statement-breakpoint
ALTER TABLE `__new_category` RENAME TO `category`;--> statement-breakpoint
CREATE UNIQUE INDEX `category_displayId_unique` ON `category` (`displayId`);