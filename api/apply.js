
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, rank, age, discordUser, discordId } = req.body;

  if (!username || !rank || !age || !discordUser || !discordId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // 🔒 Anti-Spam: limit by Discord ID (1 submission per hour)
  const rateLimitKey = `ratelimit:${discordId}`;
  const existing = await redis.get(rateLimitKey);

  if (existing) {
    return res.status(429).json({ error: "You already applied. Try again later." });
  }

  await redis.set(rateLimitKey, "true", { ex: 3600 });

  // 🎮 Get REAL Roblox avatar
  const avatarRes = await fetch(
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${discordId}&size=150x150&format=Png`
  );

  let avatarUrl = "";
  try {
    const avatarData = await avatarRes.json();
    avatarUrl = avatarData.data[0].imageUrl;
  } catch {
    avatarUrl = "";
  }

  // 💾 Save to Database
  await redis.lpush("applications", {
    username,
    rank,
    age,
    discordUser,
    discordId,
    timestamp: new Date().toISOString(),
  });

  // 📩 Send to Discord Webhook (SECURE)
  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "🔥 New LINK Tryout Application",
          color: 65535,
          thumbnail: { url: avatarUrl },
          fields: [
            { name: "Roblox Username", value: username, inline: true },
            { name: "Rank", value: rank, inline: true },
            { name: "Age", value: age, inline: true },
            { name: "Discord Username", value: discordUser },
            { name: "Discord ID", value: discordId }
          ],
          timestamp: new Date()
        }
      ]
    })
  });

  res.status(200).json({ success: true });
}
