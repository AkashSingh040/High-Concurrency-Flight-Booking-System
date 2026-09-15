require("dotenv").config();
const app =require("./app");
const pool = require("./config/db");
const redisClient=require("./config/redis");

const PORT=process.env.PORT || 3000;

const startServer = async () => {

    try {

        // Test MySQL connection
        await pool.query("SELECT 1");
        console.log("MySQL connected");

        // Connect Redis
        await redisClient.connect();
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });

    } catch (err) {

        console.error(
            "Server startup failed:",
            err.message
        );

        process.exit(1);
    }
};

startServer();