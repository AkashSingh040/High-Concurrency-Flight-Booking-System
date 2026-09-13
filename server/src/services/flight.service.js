const flightRepository=require("../repositories/flight.repository");

const getFlights=async ({from,to,page=1,limit=10})=>{
  const flights=await flightRepository.findAll();
  let result=flights;

  if(from){
    result=result.filter(flight=>flight.from===from);
  }

  if(to){
    result=result.filter(flight=>flight.to===to);
  }
  const total=result.length;
  const start=(page-1)*limit;

  const paginatedFlights=result.slice(start,start+limit);

  return {
    data:paginatedFlights,
    pagination:{
      page,limit,total,totalpages:Math.ceil(total/limit)
    }
  };
};

const getFlightById = async(id) => {
  return await flightRepository.findById(id);
};

const createFlight = async (flightData) => {
  return await flightRepository.create(flightData);
};

const updateFlight=async (id,data)=>{
  return await flightRepository.update(id, data);
};

const patchFlight = async(id, data) => {
  return await flightRepository.patch(id, data);
};

const deleteFlight = async (id) => {
  return await flightRepository.delete(id);
};

module.exports = {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  patchFlight,
  deleteFlight
};