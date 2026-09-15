const flightRepository=require("../repositories/flight.repository");

const redisClient =
    require("../config/redis");

const {
    createFlightSearchKey
} = require("../utils/cacheKeys");


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