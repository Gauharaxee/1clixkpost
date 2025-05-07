import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profileImage: true,
});

// Platform enums
export const PlatformType = {
  META: "meta",
  X: "x",
  GOOGLE: "google",
  LINKEDIN: "linkedin",
} as const;

export type PlatformType = typeof PlatformType[keyof typeof PlatformType];

// Platform connections
export const platformConnections = pgTable("platform_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platformType: text("platform_type").notNull(),
  isConnected: boolean("is_connected").notNull().default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accountName: text("account_name"),
  accountId: text("account_id"),
  followerCount: integer("follower_count"),
});

export const insertPlatformConnectionSchema = createInsertSchema(platformConnections).pick({
  userId: true,
  platformType: true,
  isConnected: true,
  accessToken: true,
  refreshToken: true,
  accountName: true,
  accountId: true,
  followerCount: true,
});

// Post status enum
export const PostStatus = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  FAILED: "failed",
} as const;

export type PostStatus = typeof PostStatus[keyof typeof PostStatus];

// Media type enum
export const MediaType = {
  IMAGE: "image",
  VIDEO: "video",
  LINK: "link",
} as const;

export type MediaType = typeof MediaType[keyof typeof MediaType];

// Posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  status: text("status").notNull().default(PostStatus.DRAFT),
  scheduledTime: timestamp("scheduled_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  platforms: jsonb("platforms").notNull(), // Array of platform IDs to post to
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  formattedContent: jsonb("formatted_content"), // Store rich text formatting
  analytics: jsonb("analytics"), // Store engagement metrics
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  status: true,
  scheduledTime: true,
  platforms: true,
  mediaUrl: true,
  mediaType: true,
  formattedContent: true,
});

// Post platform status (tracks status of each post on each platform)
export const postPlatformStatuses = pgTable("post_platform_statuses", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  platformId: integer("platform_id").notNull().references(() => platformConnections.id),
  status: text("status").notNull(),
  platformPostId: text("platform_post_id"), // ID of the post on the platform
  publishedAt: timestamp("published_at"),
  impressions: integer("impressions").default(0),
  engagements: integer("engagements").default(0),
  clicks: integer("clicks").default(0),
  shares: integer("shares").default(0),
});

export const insertPostPlatformStatusSchema = createInsertSchema(postPlatformStatuses).pick({
  postId: true,
  platformId: true,
  status: true,
  platformPostId: true,
  publishedAt: true,
  impressions: true,
  engagements: true,
  clicks: true,
  shares: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PlatformConnection = typeof platformConnections.$inferSelect;
export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PostPlatformStatus = typeof postPlatformStatuses.$inferSelect;
export type InsertPostPlatformStatus = z.infer<typeof insertPostPlatformStatusSchema>;
