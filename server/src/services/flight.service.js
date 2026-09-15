const flightRepository=require("../repositories/flight.repository");

const redisClient =
    require("../config/redis");

const {
    createFlightSearchKey
} = require("../utils/cacheKeys");

const {invalidateFlightSearchCache}=require("../utils/cacheInvalidation");

const getFlights = async ({
    from,
    to,
    page = 1,
    limit = 10
}) => {

    const cacheKey =
        createFlightSearchKey({
            from,
            to,
            page,
            limit
        });


    // -----------------------------
    // 1. Check Redis
    // -----------------------------

    try {

        const cached =
            await redisClient.get(cacheKey);


        if (cached) {

            console.log(
                "CACHE HIT:",
                cacheKey
            );

            return JSON.parse(cached);
        }


        console.log(
            "CACHE MISS:",
            cacheKey
        );

    } catch (error) {

        console.error(
            "Redis read failed:",
            error.message
        );

        // Continue to MySQL
    }


    // -----------------------------
    // 2. Cache miss → MySQL
    // -----------------------------

    const result =
        await flightRepository.search({
            from,
            to,
            page,
            limit
        });


    // -----------------------------
    // 3. Store result in Redis
    // -----------------------------

    try {

        await redisClient.set(
            cacheKey,
            JSON.stringify(result),
            {
              EX: Number(process.env.FLIGHT_CACHE_TTL||60)
            }
        );

    } catch (error) {

        console.error(
            "Redis write failed:",
            error.message
        );

        // Still return MySQL result
    }


    // -----------------------------
    // 4. Return result
    // -----------------------------

    return result;
};


const getFlightById = async(id) => {
  const flight = await flightRepository.findById(id);

  if(flight){
    await invalidateFlightSearchCache();
  }
  return flight;
};

const createFlight = async (data) => {
    const flight = await flightRepository.create(data);

    if (flight) {
        await invalidateFlightSearchCache();
    }

    return flight;
};

const updateFlight = async (id, data) => {
    const flight = await flightRepository.update(id, data);

    if (flight) {
        await invalidateFlightSearchCache();
    }

    return flight;
};

const patchFlight = async (id, data) => {
    const flight = await flightRepository.patch(id, data);

    if (flight) {
        await invalidateFlightSearchCache();
    }

    return flight;
};

const deleteFlight = async (id) => {
    const flight = await flightRepository.delete(id);

    if (flight) {
        await invalidateFlightSearchCache();
    }

    return flight;
};

module.exports = {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  patchFlight,
  deleteFlight
};