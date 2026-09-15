const express = require("express");

const {
    createBooking
} = require("../controllers/booking.controller");

const authenticate = require("../middleware/auth.middleware");

const rateLimiter=require("../middleware/redisRateLimit.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    rateLimiter,
    createBooking
);

module.exports = router;