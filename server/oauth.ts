import { Request, Response } from "express";
import { db } from "./db";
import { platformConnections, PlatformType } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  callbackUrl: string;
  scope: string[];
}

export const oauthConfigs: Record<string, OAuthConfig> = {
  meta: {
    clientId: process.env.META_CLIENT_ID || "",
    clientSecret: process.env.META_CLIENT_SECRET || "",
    authorizationUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    callbackUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/oauth/meta/callback`,
    scope: ["pages_manage_posts", "pages_read_engagement", "pages_show_list", "public_profile"],
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || "",
    clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    authorizationUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    callbackUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/oauth/twitter/callback`,
    scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    callbackUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/oauth/linkedin/callback`,
    scope: ["w_member_social", "r_liteprofile", "r_basicprofile"],
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    callbackUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/oauth/google/callback`,
    scope: ["https://www.googleapis.com/auth/business.manage", "https://www.googleapis.com/auth/userinfo.profile"],
  },
};

export function buildAuthorizationUrl(platform: string, state: string): string {
  const config = oauthConfigs[platform];
  if (!config) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callbackUrl,
    response_type: "code",
    scope: config.scope.join(" "),
    state,
  });

  // Twitter uses code_challenge for PKCE
  if (platform === "twitter") {
    params.append("code_challenge", "challenge");
    params.append("code_challenge_method", "plain");
  }

  return `${config.authorizationUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  platform: string,
  code: string
): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
  const config = oauthConfigs[platform];
  if (!config) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.callbackUrl,
    grant_type: "authorization_code",
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

export async function getPlatformUserInfo(
  platform: string,
  accessToken: string
): Promise<{ accountId: string; accountName: string; followers?: number }> {
  switch (platform) {
    case "meta": {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      );
      const data = await response.json();
      const page = data.data?.[0];
      return {
        accountId: page?.id || "",
        accountName: page?.name || "Facebook Page",
        followers: page?.followers_count,
      };
    }

    case "twitter": {
      const response = await fetch("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      return {
        accountId: data.data?.id || "",
        accountName: data.data?.username || "Twitter Account",
      };
    }

    case "linkedin": {
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      return {
        accountId: data.id || "",
        accountName: `${data.localizedFirstName} ${data.localizedLastName}`,
      };
    }

    case "google": {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return {
        accountId: data.id || "",
        accountName: data.name || "Google Account",
      };
    }

    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

export async function savePlatformConnection(
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken: string | undefined,
  expiresIn: number | undefined
) {
  const userInfo = await getPlatformUserInfo(platform, accessToken);

  const expiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 1000)
    : undefined;

  // Check if connection already exists
  const existingConnection = await db
    .select()
    .from(platformConnections)
    .where(
      and(
        eq(platformConnections.userId, userId),
        sql`${platformConnections.platform} = ${platform}`
      )
    )
    .limit(1);

  if (existingConnection.length > 0) {
    // Update existing connection
    await db
      .update(platformConnections)
      .set({
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        accountName: userInfo.accountName,
        accountId: userInfo.accountId,
        followers: userInfo.followers,
        status: "connected",
      })
      .where(eq(platformConnections.id, existingConnection[0].id));

    return existingConnection[0].id;
  } else {
    // Create new connection
    const result = await db
      .insert(platformConnections)
      .values({
        userId,
        platform: platform as PlatformType,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        accountName: userInfo.accountName,
        accountId: userInfo.accountId,
        followers: userInfo.followers,
        status: "connected",
      })
      .returning({ id: platformConnections.id });

    return result[0].id;
  }
}
