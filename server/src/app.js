const express=require("express");
const flighroutes=require("./routes/flight.routes");

const app=express();

app.use(express.json());

app.use("/api/flights",flighroutes);

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok"
    });
});

module.exports=app;