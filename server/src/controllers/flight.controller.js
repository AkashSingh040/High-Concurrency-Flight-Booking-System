const getFlights=(req,res)=>{
    res.json({
        message:"Get all flights"
    });
};

const getFlightById=(req,res)=>{
    res.json({
        message:`Get flight ${req.params.id}`
    });
};

const createFlight=(req,res)=>{
    res.status(201).json({
        message:"Fligh created"
    });
};

module.exports={
    getFlights,
    getFlightById,
    createFlight
};