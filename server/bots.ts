import TelegramBot from "node-telegram-bot-api";
import { WebClient } from "@slack/web-api";
import { storage } from "./storage";
import type { BotCredential } from "@shared/schema";

// Bot instances cache
const telegramBots: Map<string, TelegramBot> = new Map();
const slackClients: Map<string, WebClient> = new Map();

export async function initializeTelegramBot(userId: string, botToken: string): Promise<TelegramBot> {
  // Clean up existing bot if any
  const existingBot = telegramBots.get(userId);
  if (existingBot) {
    await existingBot.stopPolling();
    telegramBots.delete(userId);
  }

  // Create new bot
  const bot = new TelegramBot(botToken, { polling: true });

  // Set up command handlers
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(
      chatId,
      "Welcome to PostMaster Bot! 🚀\n\n" +
      "Use these commands:\n" +
      "/help - Show available commands\n" +
      "/create - Create a new post\n" +
      "/list - List your recent posts\n" +
      "/connections - View connected platforms"
    );
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(
      chatId,
      "📱 PostMaster Commands:\n\n" +
      "/create <content> - Create a new post\n" +
      "/list - View your recent posts\n" +
      "/connections - Check connected platforms\n" +
      "/status - Check bot status"
    );
  });

  bot.onText(/\/create (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const content = match?.[1];

    if (!content) {
      await bot.sendMessage(chatId, "Please provide content for the post: /create <your content>");
      return;
    }

    try {
      const post = await storage.createPost({
        userId,
        content,
        status: "draft",
      });

      await bot.sendMessage(
        chatId,
        `✅ Post created successfully!\n\nID: ${post.id}\nContent: ${content}\nStatus: Draft\n\nYou can schedule and publish it from the web app.`
      );
    } catch (error) {
      await bot.sendMessage(chatId, "❌ Failed to create post. Please try again.");
    }
  });

  bot.onText(/\/list/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const posts = await storage.getUserPosts(userId, 5);
      
      if (posts.length === 0) {
        await bot.sendMessage(chatId, "You don't have any posts yet. Create one with /create <content>");
        return;
      }

      let message = "📝 Your Recent Posts:\n\n";
      for (const post of posts) {
        message += `ID: ${post.id}\n`;
        message += `Content: ${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}\n`;
        message += `Status: ${post.status}\n`;
        if (post.scheduledAt) {
          message += `Scheduled: ${new Date(post.scheduledAt).toLocaleString()}\n`;
        }
        message += '\n';
      }

      await bot.sendMessage(chatId, message);
    } catch (error) {
      await bot.sendMessage(chatId, "❌ Failed to fetch posts. Please try again.");
    }
  });

  bot.onText(/\/connections/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const connections = await storage.getPlatformConnections(userId);
      
      if (connections.length === 0) {
        await bot.sendMessage(chatId, "You don't have any connected platforms yet. Connect them from the web app.");
        return;
      }

      let message = "🔗 Connected Platforms:\n\n";
      for (const conn of connections) {
        message += `${conn.platform.toUpperCase()}: ${conn.status}\n`;
        if (conn.accountName) {
          message += `Account: ${conn.accountName}\n`;
        }
        message += '\n';
      }

      await bot.sendMessage(chatId, message);
    } catch (error) {
      await bot.sendMessage(chatId, "❌ Failed to fetch connections. Please try again.");
    }
  });

  bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "✅ Bot is running and ready!");
  });

  // Store bot instance
  telegramBots.set(userId, bot);
  
  return bot;
}

export async function initializeSlackBot(userId: string, botToken: string): Promise<WebClient> {
  // Create Slack Web API client
  const client = new WebClient(botToken);
  
  // Store client
  slackClients.set(userId, client);
  
  return client;
}

export async function handleSlackCommand(
  userId: string,
  command: string,
  text: string,
  responseUrl: string
): Promise<string> {
  const client = slackClients.get(userId);
  if (!client) {
    return "Bot not initialized. Please set up your Slack bot token in settings.";
  }

  try {
    switch (command) {
      case "/postmaster-create":
        if (!text) {
          return "Please provide content: /postmaster-create <your content>";
        }
        
        const post = await storage.createPost({
          userId,
          content: text,
          status: "draft",
        });

        return `✅ Post created successfully!\n\nID: ${post.id}\nContent: ${text}\nStatus: Draft\n\nYou can schedule and publish it from the web app.`;

      case "/postmaster-list":
        const posts = await storage.getUserPosts(userId, 5);
        
        if (posts.length === 0) {
          return "You don't have any posts yet. Create one with /postmaster-create <content>";
        }

        let message = "📝 Your Recent Posts:\n\n";
        for (const post of posts) {
          message += `• ID ${post.id}: ${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''} (${post.status})\n`;
        }
        
        return message;

      case "/postmaster-connections":
        const connections = await storage.getPlatformConnections(userId);
        
        if (connections.length === 0) {
          return "You don't have any connected platforms yet. Connect them from the web app.";
        }

        let connMessage = "🔗 Connected Platforms:\n\n";
        for (const conn of connections) {
          connMessage += `• ${conn.platform.toUpperCase()}: ${conn.status}`;
          if (conn.accountName) {
            connMessage += ` (${conn.accountName})`;
          }
          connMessage += '\n';
        }
        
        return connMessage;

      case "/postmaster-help":
        return "📱 PostMaster Commands:\n\n" +
          "/postmaster-create <content> - Create a new post\n" +
          "/postmaster-list - View your recent posts\n" +
          "/postmaster-connections - Check connected platforms\n" +
          "/postmaster-help - Show this help message";

      default:
        return "Unknown command. Use /postmaster-help to see available commands.";
    }
  } catch (error) {
    console.error("Error handling Slack command:", error);
    return "❌ An error occurred. Please try again.";
  }
}

export async function stopTelegramBot(userId: string): Promise<void> {
  const bot = telegramBots.get(userId);
  if (bot) {
    await bot.stopPolling();
    telegramBots.delete(userId);
  }
}

export async function stopSlackBot(userId: string): Promise<void> {
  slackClients.delete(userId);
}

// Initialize all active bots on server start
export async function initializeAllBots(): Promise<void> {
  console.log("Initializing bots for all users...");
  
  // Note: In a real implementation, we'd need to get all users and their bot credentials
  // For now, we'll initialize bots on-demand when users interact with the API
}
