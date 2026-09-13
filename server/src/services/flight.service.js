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
  },
  {
    id: "3",
    airline: "SpiceJet",
    from: "Mumbai",
    to: "Bengaluru",
    price: 4100
  },
  {
    id: "4",
    airline: "Vistara",
    from: "Bengaluru",
    to: "Chennai",
    price: 3800
  },
  {
    id: "5",
    airline: "Akasa Air",
    from: "Chennai",
    to: "Hyderabad",
    price: 3500
  },
  {
    id: "6",
    airline: "IndiGo",
    from: "Hyderabad",
    to: "Kolkata",
    price: 4800
  },
  {
    id: "7",
    airline: "Air India",
    from: "Kolkata",
    to: "Jaipur",
    price: 5600
  },
  {
    id: "8",
    airline: "SpiceJet",
    from: "Jaipur",
    to: "Ahmedabad",
    price: 3200
  },
  {
    id: "9",
    airline: "Vistara",
    from: "Ahmedabad",
    to: "Pune",
    price: 4000
  },
  {
    id: "10",
    airline: "Akasa Air",
    from: "Pune",
    to: "Goa",
    price: 2800
  },
  {
    id: "11",
    airline: "IndiGo",
    from: "Goa",
    to: "Kochi",
    price: 3700
  },
  {
    id: "12",
    airline: "Air India",
    from: "Kochi",
    to: "Thiruvananthapuram",
    price: 2400
  },
  {
    id: "13",
    airline: "SpiceJet",
    from: "Delhi",
    to: "Lucknow",
    price: 2900
  },
  {
    id: "14",
    airline: "Vistara",
    from: "Lucknow",
    to: "Varanasi",
    price: 2200
  },
  {
    id: "15",
    airline: "Akasa Air",
    from: "Varanasi",
    to: "Patna",
    price: 2500
  },
  {
    id: "16",
    airline: "IndiGo",
    from: "Patna",
    to: "Ranchi",
    price: 2100
  },
  {
    id: "17",
    airline: "Air India",
    from: "Ranchi",
    to: "Bhubaneswar",
    price: 3300
  },
  {
    id: "18",
    airline: "SpiceJet",
    from: "Bhubaneswar",
    to: "Visakhapatnam",
    price: 3100
  },
  {
    id: "19",
    airline: "Vistara",
    from: "Visakhapatnam",
    to: "Nagpur",
    price: 4200
  },
  {
    id: "20",
    airline: "Akasa Air",
    from: "Nagpur",
    to: "Srinagar",
    price: 6500
  }
];

// const getAllFlights = () => {
//   return flights;
// };

const getFlights=({from,to,page,limit})=>{
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
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  patchFlight,
  deleteFlight
};