const flightService=require("../services/flight.service");

const getFlights=(req,res)=>{
    const {from,to}=req.query;

    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10;

    const flights=flightService.getFlights({from,to,page,limit});

    res.json({
        success:true,
        data:flights.data,
        pagination:flights.pagination
    });
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

const updateFlight = (req, res) => {
  const flight = flightService.updateFlight(
    req.params.id,
    req.body
  );

  if (!flight) {
    return res.status(404).json({
      message: "Flight not found"
    });
  }

  res.json(flight);
};

const patchFlight = (req, res) => {
  const flight = flightService.patchFlight(
    req.params.id,
    req.body
  );

  if (!flight) {
    return res.status(404).json({
      message: "Flight not found"
    });
  }

  res.json(flight);
};

const deleteFlight = (req, res) => {
  const deleted = flightService.deleteFlight(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      message: "Flight not found"
    });
  }

  res.status(204).send();
};

module.exports={
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    patchFlight,
    deleteFlight
};