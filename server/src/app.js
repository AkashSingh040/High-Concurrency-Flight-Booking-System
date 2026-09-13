const express=require("express");
const flighroutes=require("./routes/flight.routes");
const authRoutes=require("./routes/auth.routes")
const requestLogger=require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const cors=require("cors");

const app=express();

app.use(cors({
    origin:process.env.FRONTEND_API
}))

app.use(express.json());
app.use(requestLogger);

app.use("/api/v1/flights",flighroutes);
app.use("/api/v1/auth",authRoutes);


app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok"
    });
});
app.use(errorHandler);

module.exports=app;