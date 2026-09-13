const express = require("express");

const {
    createBooking
} = require("../controllers/booking.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    createBooking
);

module.exports = router;