import { 
  User, 
  InsertUser, 
  Post, 
  InsertPost, 
  PlatformConnection, 
  InsertPlatformConnection,
  PostPlatformStatus,
  InsertPostPlatformStatus,
  users,
  platformConnections,
  posts,
  postPlatformStatuses,
  PostStatus
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Platform connection operations
  getPlatformConnections(userId: number): Promise<PlatformConnection[]>;
  getPlatformConnection(id: number): Promise<PlatformConnection | undefined>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: number, connection: Partial<InsertPlatformConnection>): Promise<PlatformConnection | undefined>;
  
  // Post operations
  getPosts(userId: number, status?: string): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Post platform status operations
  getPostPlatformStatuses(postId: number): Promise<PostPlatformStatus[]>;
  createPostPlatformStatus(status: InsertPostPlatformStatus): Promise<PostPlatformStatus>;
  updatePostPlatformStatus(id: number, status: Partial<InsertPostPlatformStatus>): Promise<PostPlatformStatus | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private platformConnections: Map<number, PlatformConnection>;
  private posts: Map<number, Post>;
  private postPlatformStatuses: Map<number, PostPlatformStatus>;
  
  currentUserId: number;
  currentPlatformConnectionId: number;
  currentPostId: number;
  currentPostPlatformStatusId: number;

  constructor() {
    this.users = new Map();
    this.platformConnections = new Map();
    this.posts = new Map();
    this.postPlatformStatuses = new Map();
    
    this.currentUserId = 1;
    this.currentPlatformConnectionId = 1;
    this.currentPostId = 1;
    this.currentPostPlatformStatusId = 1;
    
    // Initialize with a demo user
    this.createUser({
      username: "demo",
      password: "password",
      name: "John Smith",
      email: "john@example.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Platform connection operations
  async getPlatformConnections(userId: number): Promise<PlatformConnection[]> {
    return Array.from(this.platformConnections.values()).filter(
      (conn) => conn.userId === userId
    );
  }
  
  async getPlatformConnection(id: number): Promise<PlatformConnection | undefined> {
    return this.platformConnections.get(id);
  }
  
  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const id = this.currentPlatformConnectionId++;
    const platformConnection: PlatformConnection = { ...connection, id };
    this.platformConnections.set(id, platformConnection);
    return platformConnection;
  }
  
  async updatePlatformConnection(
    id: number, 
    connection: Partial<InsertPlatformConnection>
  ): Promise<PlatformConnection | undefined> {
    const existing = this.platformConnections.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...connection };
    this.platformConnections.set(id, updated);
    return updated;
  }
  
  // Post operations
  async getPosts(userId: number, status?: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => {
        if (post.userId !== userId) return false;
        if (status && post.status !== status) return false;
        return true;
      })
      .sort((a, b) => {
        // Sort by created date descending
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const createdAt = new Date();
    const newPost: Post = { ...post, id, createdAt };
    this.posts.set(id, newPost);
    return newPost;
  }
  
  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const existing = this.posts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...post };
    this.posts.set(id, updated);
    return updated;
  }
  
  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }
  
  // Post platform status operations
  async getPostPlatformStatuses(postId: number): Promise<PostPlatformStatus[]> {
    return Array.from(this.postPlatformStatuses.values())
      .filter((status) => status.postId === postId);
  }
  
  async createPostPlatformStatus(status: InsertPostPlatformStatus): Promise<PostPlatformStatus> {
    const id = this.currentPostPlatformStatusId++;
    const postPlatformStatus: PostPlatformStatus = { ...status, id };
    this.postPlatformStatuses.set(id, postPlatformStatus);
    return postPlatformStatus;
  }
  
  async updatePostPlatformStatus(
    id: number, 
    status: Partial<InsertPostPlatformStatus>
  ): Promise<PostPlatformStatus | undefined> {
    const existing = this.postPlatformStatuses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...status };
    this.postPlatformStatuses.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
