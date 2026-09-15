const redisClient = require("../config/redis");


const invalidateFlightSearchCache = async () => {

    const keys = [];

    try {

        for await (
            const key of redisClient.scanIterator({
                MATCH: "flight:search:*",
                COUNT: 100
            })
        ) {
            keys.push(key);
        }


        if (keys.length === 0) {
            console.log(
                "No flight-search cache keys to invalidate"
            );

            return;
        }


        await redisClient.del(keys);

        console.log(
            `Invalidated ${keys.length} flight-search cache keys`
        );

    } catch (error) {

        console.error(
            "Flight-search cache invalidation failed:",
            error.message
        );
    }
};


module.exports = {
    invalidateFlightSearchCache
};