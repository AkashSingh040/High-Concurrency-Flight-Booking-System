const express=require("express");
const {getFlights,getFlightById,createFlight,updateFlight,patchFlight,deleteFlight}=require("../controllers/flight.controller");

const router=express.Router();

router.get("/",getFlights);
router.get("/:id",getFlightById);

router.post("/",createFlight);

router.put("/:id", updateFlight);
router.patch("/:id", patchFlight);
router.delete("/:id", deleteFlight);
module.exports=router;