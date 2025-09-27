import {
  users,
  type User,
  type UpsertUser,
  type InsertUser,
  platformConnections,
  type PlatformConnection,
  type InsertPlatformConnection,
  posts,
  type Post,
  type InsertPost,
  postPlatforms,
  type PostPlatform,
  type InsertPostPlatform,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Legacy user methods (keeping for backward compatibility)
  createUser(user: InsertUser): Promise<User>;
  
  // Platform connection methods
  getPlatformConnections(userId: string): Promise<PlatformConnection[]>;
  getPlatformConnection(id: number): Promise<PlatformConnection | undefined>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: number, data: Partial<InsertPlatformConnection>): Promise<PlatformConnection>;
  deletePlatformConnection(id: number): Promise<void>;
  
  // Posts methods
  getPost(id: number): Promise<Post | undefined>;
  getUserPosts(userId: string, limit?: number, offset?: number): Promise<Post[]>;
  getScheduledPosts(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, data: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
  
  // Post platform methods
  getPostPlatforms(postId: number): Promise<PostPlatform[]>;
  createPostPlatform(postPlatform: InsertPostPlatform): Promise<PostPlatform>;
  updatePostPlatform(id: number, data: Partial<InsertPostPlatform>): Promise<PostPlatform>;
  deletePostPlatform(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private platformConnections: Map<number, PlatformConnection>;
  private posts: Map<number, Post>;
  private postPlatforms: Map<number, PostPlatform>;
  
  private platformConnectionId: number;
  private postId: number;
  private postPlatformId: number;

  constructor() {
    this.users = new Map();
    this.platformConnections = new Map();
    this.posts = new Map();
    this.postPlatforms = new Map();
    
    this.platformConnectionId = 1;
    this.postId = 1;
    this.postPlatformId = 1;
  }

  // User methods (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!userData.id) {
      throw new Error("User ID is required for upsert operation");
    }
    
    const existingUser = this.users.get(userData.id);
    const now = new Date();
    
    const user: User = existingUser
      ? { ...existingUser, ...userData, updatedAt: now }
      : { 
          id: userData.id,
          email: userData.email ?? null,
          firstName: userData.firstName ?? null,
          lastName: userData.lastName ?? null,
          profileImageUrl: userData.profileImageUrl ?? null,
          planType: userData.planType ?? "free",
          createdAt: now,
          updatedAt: now,
        };
    
    this.users.set(userData.id, user);
    return user;
  }

  // Legacy user method (keeping for backward compatibility)
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date();
    const user: User = { 
      id,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      planType: insertUser.planType ?? "free",
      createdAt: now, 
      updatedAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Platform connection methods
  async getPlatformConnections(userId: string): Promise<PlatformConnection[]> {
    return Array.from(this.platformConnections.values()).filter(
      (connection) => connection.userId === userId,
    );
  }
  
  async getPlatformConnection(id: number): Promise<PlatformConnection | undefined> {
    return this.platformConnections.get(id);
  }
  
  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const id = this.platformConnectionId++;
    const newConnection: PlatformConnection = { 
      ...connection, 
      id,
      accountName: connection.accountName ?? null,
      accountId: connection.accountId ?? null,
      status: connection.status ?? "connected",
      token: connection.token ?? null,
      tokenSecret: connection.tokenSecret ?? null,
      refreshToken: connection.refreshToken ?? null,
      expiresAt: connection.expiresAt ?? null,
      followers: connection.followers ?? null,
      metadata: connection.metadata ?? null,
    };
    this.platformConnections.set(id, newConnection);
    return newConnection;
  }
  
  async updatePlatformConnection(id: number, data: Partial<InsertPlatformConnection>): Promise<PlatformConnection> {
    const connection = this.platformConnections.get(id);
    if (!connection) {
      throw new Error(`Platform connection with id ${id} not found`);
    }
    
    const updatedConnection = { ...connection, ...data };
    this.platformConnections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  async deletePlatformConnection(id: number): Promise<void> {
    this.platformConnections.delete(id);
  }
  
  // Posts methods
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getUserPosts(userId: string, limit = 10, offset = 0): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => {
        // Sort by created date, newest first
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(offset, offset + limit);
  }
  
  async getScheduledPosts(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.userId === userId && post.status === "scheduled")
      .sort((a, b) => {
        // Sort by scheduled date, soonest first
        const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
        const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
        return dateA - dateB;
      });
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const id = this.postId++;
    const now = new Date();
    const newPost: Post = { 
      ...post, 
      id, 
      createdAt: now,
      publishedAt: post.status === "published" ? now : null,
      imageUrl: post.imageUrl ?? null,
      scheduledAt: post.scheduledAt ?? null,
      status: post.status ?? "draft",
    };
    this.posts.set(id, newPost);
    return newPost;
  }
  
  async updatePost(id: number, data: Partial<InsertPost>): Promise<Post> {
    const post = this.posts.get(id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    
    const updatedPost = { ...post, ...data };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deletePost(id: number): Promise<void> {
    this.posts.delete(id);
    
    // Also delete associated post platforms
    for (const [platformId, platform] of Array.from(this.postPlatforms.entries())) {
      if (platform.postId === id) {
        this.postPlatforms.delete(platformId);
      }
    }
  }
  
  // Post platform methods
  async getPostPlatforms(postId: number): Promise<PostPlatform[]> {
    return Array.from(this.postPlatforms.values())
      .filter((platform) => platform.postId === postId);
  }
  
  async createPostPlatform(postPlatform: InsertPostPlatform): Promise<PostPlatform> {
    const id = this.postPlatformId++;
    const newPostPlatform: PostPlatform = { 
      ...postPlatform, 
      id,
      status: postPlatform.status ?? "pending",
      platformPostId: postPlatform.platformPostId ?? null,
      engagementCount: postPlatform.engagementCount ?? null,
      impressions: postPlatform.impressions ?? null,
      clicks: postPlatform.clicks ?? null,
    };
    this.postPlatforms.set(id, newPostPlatform);
    return newPostPlatform;
  }
  
  async updatePostPlatform(id: number, data: Partial<InsertPostPlatform>): Promise<PostPlatform> {
    const platform = this.postPlatforms.get(id);
    if (!platform) {
      throw new Error(`Post platform with id ${id} not found`);
    }
    
    const updatedPlatform = { ...platform, ...data };
    this.postPlatforms.set(id, updatedPlatform);
    return updatedPlatform;
  }
  
  async deletePostPlatform(id: number): Promise<void> {
    this.postPlatforms.delete(id);
  }
}

// Database storage implementation for production
export class DatabaseStorage implements IStorage {
  // User methods (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Legacy user method (keeping for backward compatibility)
  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const userWithId = {
      ...insertUser,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const [user] = await db.insert(users).values(userWithId).returning();
    return user;
  }

  // Platform connection methods
  async getPlatformConnections(userId: string): Promise<PlatformConnection[]> {
    return await db
      .select()
      .from(platformConnections)
      .where(eq(platformConnections.userId, userId));
  }

  async getPlatformConnection(id: number): Promise<PlatformConnection | undefined> {
    const [connection] = await db
      .select()
      .from(platformConnections)
      .where(eq(platformConnections.id, id));
    return connection;
  }

  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const [newConnection] = await db
      .insert(platformConnections)
      .values(connection)
      .returning();
    return newConnection;
  }

  async updatePlatformConnection(id: number, data: Partial<InsertPlatformConnection>): Promise<PlatformConnection> {
    const [updatedConnection] = await db
      .update(platformConnections)
      .set(data)
      .where(eq(platformConnections.id, id))
      .returning();
    return updatedConnection;
  }

  async deletePlatformConnection(id: number): Promise<void> {
    await db.delete(platformConnections).where(eq(platformConnections.id, id));
  }

  // Posts methods
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getUserPosts(userId: string, limit = 10, offset = 0): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(posts.createdAt)
      .limit(limit)
      .offset(offset);
  }

  async getScheduledPosts(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(posts.scheduledAt);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, data: Partial<InsertPost>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
    await db.delete(postPlatforms).where(eq(postPlatforms.postId, id));
  }

  // Post platform methods
  async getPostPlatforms(postId: number): Promise<PostPlatform[]> {
    return await db
      .select()
      .from(postPlatforms)
      .where(eq(postPlatforms.postId, postId));
  }

  async createPostPlatform(postPlatform: InsertPostPlatform): Promise<PostPlatform> {
    const [newPostPlatform] = await db
      .insert(postPlatforms)
      .values(postPlatform)
      .returning();
    return newPostPlatform;
  }

  async updatePostPlatform(id: number, data: Partial<InsertPostPlatform>): Promise<PostPlatform> {
    const [updatedPlatform] = await db
      .update(postPlatforms)
      .set(data)
      .where(eq(postPlatforms.id, id))
      .returning();
    return updatedPlatform;
  }

  async deletePostPlatform(id: number): Promise<void> {
    await db.delete(postPlatforms).where(eq(postPlatforms.id, id));
  }
}

// Use database storage by default
export const storage = new DatabaseStorage();

// Keep memory storage available for testing
export const memStorage = new MemStorage();
