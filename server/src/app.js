const express=require("express");
const flighroutes=require("./routes/flight.routes");
const requestLogger=require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app=express();

app.use(express.json());
app.use(requestLogger);

app.use("/api/flights",flighroutes);


app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok"
    });
});
app.use(errorHandler);

module.exports=app;