/*
--- Cache Performance Test ---

1. First request (expected CACHE MISS)
Response time: 48.73 ms

2. Second request (expected CACHE HIT)
Response time: 4.63 ms

--- Results ---
Cache MISS: 48.73 ms
Cache HIT : 4.63 ms
Improvement: 44.09 ms
Improvement: 90.49%
PS D:\High-Concurrency-Flight-Booking-System> 
*/

const BASE_URL =
    "http://localhost:5005/api/v1";

const searchFlights = async () => {
    const start = performance.now();

    const response = await fetch(
        `${BASE_URL}/flights?from=SXR&to=DEL&page=1&limit=10`
    );

    const data = await response.json();

    const end = performance.now();

    return {
        status: response.status,
        data,
        time: end - start
    };
};

const runTest = async () => {

    console.log("\n--- Cache Performance Test ---\n");

    console.log("1. First request (expected CACHE MISS)");

    const firstRequest =
        await searchFlights();

    console.log(
        `Response time: ${firstRequest.time.toFixed(2)} ms`
    );

    console.log("\n2. Second request (expected CACHE HIT)");

    const secondRequest =
        await searchFlights();

    console.log(
        `Response time: ${secondRequest.time.toFixed(2)} ms`
    );

    const improvement =
        firstRequest.time - secondRequest.time;

    const percentage =
        (improvement / firstRequest.time) * 100;

    console.log("\n--- Results ---");

    console.log(
        `Cache MISS: ${firstRequest.time.toFixed(2)} ms`
    );

    console.log(
        `Cache HIT : ${secondRequest.time.toFixed(2)} ms`
    );

    console.log(
        `Improvement: ${improvement.toFixed(2)} ms`
    );

    console.log(
        `Improvement: ${percentage.toFixed(2)}%`
    );
};

runTest();