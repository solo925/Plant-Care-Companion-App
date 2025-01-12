import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

(async () => {
  redisClient = createClient({ url: "redis://localhost:6379" });
  await redisClient.connect();
  console.log("Redis client connected");
})().catch((err) => {
  console.error("Redis client failed to connect:", err);
});

const rateLimitMiddleware = async (
  req:any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!redisClient) {
      res.status(500).json({ message: "Redis client not initialized" });
      return;
    }

    const userId = req.user?.id; // Assuming `req.user` exists from previous middleware
    const postId = req.params.postId; // Assuming `req.params.postId` exists
    const rateLimitKey = `rateLimit:${userId}:${postId}`;

    const requests = await redisClient.get(rateLimitKey);
    if (requests && parseInt(requests) > 5) {
      res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
      return;
    }

    await redisClient
      .multi()
      .incr(rateLimitKey) // Increment the request count
      .expire(rateLimitKey, 60) // Set expiration time (60 seconds)
      .exec();

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Error in rateLimitMiddleware:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default rateLimitMiddleware;
