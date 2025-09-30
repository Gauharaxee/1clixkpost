import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  planType: text("plan_type").default("free").notNull(),
});

export const platformTypes = ["meta", "twitter", "linkedin", "google"] as const;
export type PlatformType = typeof platformTypes[number];

export const platformConnections = pgTable("platform_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform", { enum: platformTypes }).notNull(),
  accountName: text("account_name"),
  accountId: text("account_id"),
  status: text("status").default("connected").notNull(),
  token: text("token"),
  tokenSecret: text("token_secret"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  followers: integer("followers"),
  metadata: jsonb("metadata"),
});

export const postStatus = ["draft", "scheduled", "published", "failed"] as const;
export type PostStatus = typeof postStatus[number];

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  status: text("status", { enum: postStatus }).default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postPlatforms = pgTable("post_platforms", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  platform: text("platform", { enum: platformTypes }).notNull(),
  platformPostId: text("platform_post_id"),
  status: text("status").default("pending").notNull(),
  engagementCount: integer("engagement_count").default(0),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  avatar: true,
});

export const insertPlatformConnectionSchema = createInsertSchema(platformConnections).pick({
  userId: true,
  platform: true,
  accountName: true,
  accountId: true,
  status: true,
  token: true,
  tokenSecret: true,
  refreshToken: true,
  expiresAt: true,
  followers: true,
  metadata: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  imageUrl: true,
  status: true,
  scheduledAt: true,
  publishedAt: true,
});

export const insertPostPlatformSchema = createInsertSchema(postPlatforms).pick({
  postId: true,
  platform: true,
  status: true,
});

// Types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertPostPlatform = z.infer<typeof insertPostPlatformSchema>;

// Types for select operations
export type User = typeof users.$inferSelect;
export type PlatformConnection = typeof platformConnections.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type PostPlatform = typeof postPlatforms.$inferSelect;

// Extended types for API responses
export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().optional(),
  platforms: z.array(z.enum(platformTypes)).min(1, "At least one platform is required"),
  status: z.enum(postStatus).default("draft"),
  scheduledAt: z.string().datetime().optional(),
});

export type CreatePostRequest = z.infer<typeof createPostSchema>;

export const postWithPlatformsSchema = z.object({
  post: z.object({
    id: z.number(),
    content: z.string(),
    imageUrl: z.string().optional(),
    status: z.enum(postStatus),
    scheduledAt: z.string().datetime().optional(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
  }),
  platforms: z.array(
    z.object({
      platform: z.enum(platformTypes),
      status: z.string(),
      engagementCount: z.number().optional(),
      impressions: z.number().optional(),
      clicks: z.number().optional(),
    })
  ),
});

export type PostWithPlatforms = z.infer<typeof postWithPlatformsSchema>;
