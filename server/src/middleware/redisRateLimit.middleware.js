const redisClient =
    require("../config/redis");

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 100;

const redisRateLimiter = async (
    req,
    res,
    next
) => {

    const userId = req.user.userId;

    const key =
        `rate-limit:user:${userId}`;

    try {

        const count =
            await redisClient.incr(key);

        if (count === 1) {
            await redisClient.expire(
                key,
                WINDOW_SECONDS
            );
        }

        const remaining =
            Math.max(
                0,
                MAX_REQUESTS - count
            );

        res.setHeader(
            "X-RateLimit-Limit",
            MAX_REQUESTS
        );

        res.setHeader(
            "X-RateLimit-Remaining",
            remaining
        );

        if (count > MAX_REQUESTS) {

            return res.status(429).json({
                success: false,
                error: {
                    code: "RATE_LIMIT_EXCEEDED",
                    message: "Too many requests"
                }
            });
        }

        next();

    } catch (error) {

        console.error(
            "Redis rate limiter failed:",
            error.message
        );

        next();
    }
};

module.exports = redisRateLimiter;