const express=require("express");
const {getFlights,getFlightById,createFlight,updateFlight,patchFlight,deleteFlight}=require("../controllers/flight.controller");

const validateFlight=require("../middleware/validateFlights");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router=express.Router();

router.get("/",authenticate,getFlights);
router.get("/:id",authenticate,getFlightById);

router.post("/",authenticate,authorize("ADMIN"),validateFlight,createFlight);

router.put("/:id",authenticate,authorize("ADMIN"), updateFlight);
router.patch("/:id", authenticate,authorize("ADMIN"),patchFlight);
router.delete("/:id", authenticate,authorize("ADMIN"),deleteFlight);
module.exports=router;