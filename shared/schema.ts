import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Session storage table for Replit Auth
// Referenced from blueprint:javascript_log_in_with_replit
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
// Referenced from blueprint:javascript_log_in_with_replit
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  planType: text("plan_type").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const platformTypes = ["meta", "twitter", "linkedin", "google"] as const;
export type PlatformType = typeof platformTypes[number];

export const platformConnections = pgTable("platform_connections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
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
  userId: varchar("user_id").notNull().references(() => users.id),
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

export const apiCredentials = pgTable("api_credentials", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: text("platform", { enum: platformTypes }).notNull(),
  clientId: text("client_id"),
  clientSecret: text("client_secret"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const botTypes = ["slack", "telegram"] as const;
export type BotType = typeof botTypes[number];

export const botCredentials = pgTable("bot_credentials", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  botType: text("bot_type", { enum: botTypes }).notNull(),
  botToken: text("bot_token"),
  signingSecret: text("signing_secret"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
// User insert/upsert schema for Replit Auth
// Referenced from blueprint:javascript_log_in_with_replit
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  planType: true,
});

export const upsertUserSchema = insertUserSchema.partial().required({ id: true });
export type UpsertUser = z.infer<typeof upsertUserSchema>;

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

export const insertApiCredentialSchema = createInsertSchema(apiCredentials).pick({
  userId: true,
  platform: true,
  clientId: true,
  clientSecret: true,
});

export const insertBotCredentialSchema = createInsertSchema(botCredentials).pick({
  userId: true,
  botType: true,
  botToken: true,
  signingSecret: true,
  isActive: true,
});

// Types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertPostPlatform = z.infer<typeof insertPostPlatformSchema>;
export type InsertApiCredential = z.infer<typeof insertApiCredentialSchema>;
export type InsertBotCredential = z.infer<typeof insertBotCredentialSchema>;

// Types for select operations
export type User = typeof users.$inferSelect;
export type PlatformConnection = typeof platformConnections.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type PostPlatform = typeof postPlatforms.$inferSelect;
export type ApiCredential = typeof apiCredentials.$inferSelect;
export type BotCredential = typeof botCredentials.$inferSelect;

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
