const express=require("express");
const {getFlights,getFlightById,createFlight,updateFlight,patchFlight,deleteFlight}=require("../controllers/flight.controller");
const validateFlight=require("../middleware/validateFlights");

const router=express.Router();

router.get("/",getFlights);
router.get("/:id",getFlightById);

router.post("/",validateFlight,createFlight);

router.put("/:id", updateFlight);
router.patch("/:id", patchFlight);
router.delete("/:id", deleteFlight);
module.exports=router;