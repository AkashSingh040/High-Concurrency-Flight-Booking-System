const express=require("express");
const {getFlights,getFlightById,createFlight}=require("../controllers/flight.controller");

const router=express.Router();

router.get("/",getFlights);

router.get("/:id",getFlightById);

router.post("/",createFlight);

module.exports=router;