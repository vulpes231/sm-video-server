const rateLimit = require("express-rate-limit");

// Create rate limiter middleware
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	standardHeaders: true, // Return rate limit info in headers
	legacyHeaders: false, // Disable X-RateLimit-* headers
	message: "Too many requests, please try again later.",
});

module.exports = { apiLimiter };
