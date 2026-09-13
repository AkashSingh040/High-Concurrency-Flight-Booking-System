const flightService=require("../services/flight.service");

const getFlights=(req,res)=>{
    const flights=flightService.getAllFlights();
    res.json(flights);
};

const getFlightById=(req,res)=>{
    const flight=flightService.getFlightById(req.params.id);
    if(!flight){
        return res.status(404).json({
            message:"Flight not found"
        });
    }
    res.json(flight);
};

const createFlight=(req,res)=>{
    const flight=flightService.createFlight(req.body);
    res.status(201).json(flight);
};

module.exports={
    getFlights,
    getFlightById,
    createFlight
};