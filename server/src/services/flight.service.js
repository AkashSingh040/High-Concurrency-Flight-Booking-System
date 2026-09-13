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

module.exports = {
  getAllFlights,
  getFlightById,
  createFlight
};