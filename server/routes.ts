import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPostSchema, 
  insertPlatformConnectionSchema, 
  insertPostPlatformStatusSchema,
  PostStatus
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const api = express.Router();
  app.use("/api", api);

  // Session-based authentication (simple for demo)
  api.post("/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // For demo purposes, storing user in session
    if (req.session) {
      req.session.userId = user.id;
      req.session.username = user.username;
    }
    
    return res.json({ 
      id: user.id, 
      username: user.username,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    });
  });
  
  api.post("/auth/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "No session to logout from" });
    }
  });
  
  api.get("/auth/session", async (req: Request, res: Response) => {
    if (req.session && req.session.userId) {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        return res.json({ 
          id: user.id, 
          username: user.username,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage
        });
      }
    }
    res.status(401).json({ message: "Not authenticated" });
  });
  
  // Middleware to check if user is authenticated
  const authenticate = async (req: Request, res: Response, next: Function) => {
    // In a real app, implement proper authentication
    // For demo, considering any user as authenticated or using first user
    if (req.session && req.session.userId) {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    }
    
    // For demo purposes, allow demo user
    const demoUser = await storage.getUserByUsername("demo");
    if (demoUser) {
      req.user = demoUser;
      if (req.session) {
        req.session.userId = demoUser.id;
        req.session.username = demoUser.username;
      }
      return next();
    }
    
    return res.status(401).json({ message: "Authentication required" });
  };
  
  // Platform connections
  api.get("/platforms", authenticate, async (req: Request, res: Response) => {
    const connections = await storage.getPlatformConnections(req.user.id);
    res.json(connections);
  });
  
  api.post("/platforms", authenticate, async (req: Request, res: Response) => {
    try {
      const connectionData = insertPlatformConnectionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const connection = await storage.createPlatformConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create platform connection" });
    }
  });
  
  api.put("/platforms/:id", authenticate, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    // Verify the platform connection belongs to the user
    const existingConnection = await storage.getPlatformConnection(id);
    if (!existingConnection) {
      return res.status(404).json({ message: "Platform connection not found" });
    }
    
    if (existingConnection.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this connection" });
    }
    
    try {
      const connectionData = insertPlatformConnectionSchema.partial().parse(req.body);
      const updated = await storage.updatePlatformConnection(id, connectionData);
      if (updated) {
        return res.json(updated);
      }
      return res.status(404).json({ message: "Platform connection not found" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update platform connection" });
    }
  });
  
  // Posts
  api.get("/posts", authenticate, async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const posts = await storage.getPosts(req.user.id, status);
    res.json(posts);
  });
  
  api.get("/posts/:id", authenticate, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const post = await storage.getPost(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this post" });
    }
    
    // Get platform statuses for the post
    const platformStatuses = await storage.getPostPlatformStatuses(id);
    
    res.json({
      ...post,
      platformStatuses
    });
  });
  
  api.post("/posts", authenticate, async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const post = await storage.createPost(postData);
      
      // Create platform statuses if needed
      if (postData.platforms && Array.isArray(postData.platforms)) {
        for (const platformId of postData.platforms) {
          await storage.createPostPlatformStatus({
            postId: post.id,
            platformId,
            status: post.status,
            impressions: 0,
            engagements: 0,
            clicks: 0,
            shares: 0
          });
        }
      }
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  
  api.put("/posts/:id", authenticate, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    // Verify the post belongs to the user
    const existingPost = await storage.getPost(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }
    
    try {
      const postData = insertPostSchema.partial().parse(req.body);
      const updated = await storage.updatePost(id, postData);
      
      // Update platform statuses if platforms changed
      if (postData.platforms && Array.isArray(postData.platforms)) {
        // Get current platform statuses
        const currentStatuses = await storage.getPostPlatformStatuses(id);
        const currentPlatformIds = currentStatuses.map(status => status.platformId);
        
        // Add new platforms
        for (const platformId of postData.platforms) {
          if (!currentPlatformIds.includes(platformId)) {
            await storage.createPostPlatformStatus({
              postId: id,
              platformId,
              status: updated?.status || PostStatus.DRAFT,
              impressions: 0,
              engagements: 0,
              clicks: 0,
              shares: 0
            });
          }
        }
      }
      
      if (updated) {
        return res.json(updated);
      }
      return res.status(404).json({ message: "Post not found" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update post" });
    }
  });
  
  api.delete("/posts/:id", authenticate, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    // Verify the post belongs to the user
    const existingPost = await storage.getPost(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    
    const deleted = await storage.deletePost(id);
    if (deleted) {
      return res.json({ message: "Post deleted successfully" });
    }
    return res.status(404).json({ message: "Post not found" });
  });
  
  // Post Analytics and Platform Statuses
  api.get("/posts/:id/analytics", authenticate, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    // Verify the post belongs to the user
    const post = await storage.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this post" });
    }
    
    // Get platform statuses
    const platformStatuses = await storage.getPostPlatformStatuses(id);
    
    // Calculate metrics
    const metrics = {
      impressions: platformStatuses.reduce((sum, status) => sum + (status.impressions || 0), 0),
      engagements: platformStatuses.reduce((sum, status) => sum + (status.engagements || 0), 0),
      clicks: platformStatuses.reduce((sum, status) => sum + (status.clicks || 0), 0),
      shares: platformStatuses.reduce((sum, status) => sum + (status.shares || 0), 0),
      platforms: platformStatuses.map(status => ({
        platformId: status.platformId,
        status: status.status,
        platformPostId: status.platformPostId,
        publishedAt: status.publishedAt,
        impressions: status.impressions || 0,
        engagements: status.engagements || 0,
        clicks: status.clicks || 0,
        shares: status.shares || 0
      }))
    };
    
    res.json(metrics);
  });
  
  // Dashboard summary
  api.get("/dashboard", authenticate, async (req: Request, res: Response) => {
    const userId = req.user.id;
    
    // Get counts by status
    const allPosts = await storage.getPosts(userId);
    const publishedPosts = allPosts.filter(post => post.status === PostStatus.PUBLISHED);
    const scheduledPosts = allPosts.filter(post => post.status === PostStatus.SCHEDULED);
    const draftPosts = allPosts.filter(post => post.status === PostStatus.DRAFT);
    
    // Get platform connections
    const platforms = await storage.getPlatformConnections(userId);
    
    // Recent activity - take last 5 posts
    const recentPosts = allPosts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Mock summary metrics (in a real app, these would come from the actual platforms)
    const summary = {
      postsPublished: publishedPosts.length,
      impressions: 24500,
      engagementRate: 4.3,
      scheduledPosts: scheduledPosts.length,
      recentPosts,
      platforms,
    };
    
    res.json(summary);
  });

  const httpServer = createServer(app);
  return httpServer;
}
