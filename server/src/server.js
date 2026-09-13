require("dotenv").config();
const app =require("./app");
const pool = require("./config/db");

const PORT=process.env.PORT || 3000;

pool.query("SELECT 1")
    .then(() => {
        console.log("MySQL connected");
    })
    .catch((err) => {
        console.error("MySQL connection failed:", err.message);
    });

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});