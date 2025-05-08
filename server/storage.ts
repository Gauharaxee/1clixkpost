import { users, type User, type InsertUser, platformConnections, type PlatformConnection, type InsertPlatformConnection, posts, type Post, type InsertPost, postPlatforms, type PostPlatform, type InsertPostPlatform } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Platform connection methods
  getPlatformConnections(userId: number): Promise<PlatformConnection[]>;
  getPlatformConnection(id: number): Promise<PlatformConnection | undefined>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: number, data: Partial<InsertPlatformConnection>): Promise<PlatformConnection>;
  deletePlatformConnection(id: number): Promise<void>;
  
  // Posts methods
  getPost(id: number): Promise<Post | undefined>;
  getUserPosts(userId: number, limit?: number, offset?: number): Promise<Post[]>;
  getScheduledPosts(userId: number): Promise<Post[]>;
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
  private users: Map<number, User>;
  private platformConnections: Map<number, PlatformConnection>;
  private posts: Map<number, Post>;
  private postPlatforms: Map<number, PostPlatform>;
  
  private userId: number;
  private platformConnectionId: number;
  private postId: number;
  private postPlatformId: number;

  constructor() {
    this.users = new Map();
    this.platformConnections = new Map();
    this.posts = new Map();
    this.postPlatforms = new Map();
    
    this.userId = 1;
    this.platformConnectionId = 1;
    this.postId = 1;
    this.postPlatformId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Platform connection methods
  async getPlatformConnections(userId: number): Promise<PlatformConnection[]> {
    return Array.from(this.platformConnections.values()).filter(
      (connection) => connection.userId === userId,
    );
  }
  
  async getPlatformConnection(id: number): Promise<PlatformConnection | undefined> {
    return this.platformConnections.get(id);
  }
  
  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const id = this.platformConnectionId++;
    const newConnection: PlatformConnection = { ...connection, id };
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
  
  async getUserPosts(userId: number, limit = 10, offset = 0): Promise<Post[]> {
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
  
  async getScheduledPosts(userId: number): Promise<Post[]> {
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
      createdAt: now 
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
    for (const [platformId, platform] of this.postPlatforms.entries()) {
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
    const newPostPlatform: PostPlatform = { ...postPlatform, id };
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

export const storage = new MemStorage();
