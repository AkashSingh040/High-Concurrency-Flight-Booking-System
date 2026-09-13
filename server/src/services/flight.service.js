const flights = [
  {
    id: "1",
    airline: "IndiGo",
    from: "Srinagar",
    to: "Delhi",
    price: 4500
  },
  {
    id: "2",
    airline: "Air India",
    from: "Delhi",
    to: "Mumbai",
    price: 5200
  }
];

const getAllFlights = () => {
  return flights;
};

const getFlightById = (id) => {
  return flights.find(flight => flight.id === id);
};

const createFlight = (flightData) => {
  const flight = {
    id: String(flights.length + 1),
    ...flightData
  };

  flights.push(flight);

  return flight;
};

const updateFlight=(id,data)=>{
  const index=flights.findIndex(flight=> flight.id===id);

  if(index===-1){
    return null;
  }

  flights[index]={
    id,...data
  };

  return flights[index];
};

const patchFlight = (id, data) => {
  const index = flights.findIndex(flight => flight.id === id);

  if (index === -1) {
    return null;
  }

  flights[index] = {
    ...flights[index],
    ...data
  };

  return flights[index];
};

const deleteFlight = (id) => {
  const index = flights.findIndex(flight => flight.id === id);

  if (index === -1) {
    return false;
  }

  flights.splice(index, 1);

  return true;
};

module.exports = {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  patchFlight,
  deleteFlight
};