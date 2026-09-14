const bookingUrl =
    "http://localhost:5005/api/v1/bookings";

const userAToken = "TOKEN_USER_A";
const userBToken = "TOKEN_USER_B";

const createBooking = async (token) => {

    const response = await fetch(
        bookingUrl,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                flightId: 1,
                seatId: 1
            })
        }
    );

    const data = await response.json();

    return {
        status: response.status,
        data
    };
};

const runTest = async () => {

    console.log("Sending concurrent booking requests...");

    const results = await Promise.all([
        createBooking(userAToken),
        createBooking(userBToken)
    ]);

    console.log("\nRESULTS:");

    console.dir(
        results,
        { depth: null }
    );
};

runTest();

/*
PS D:\High-Concurrency-Flight-Booking-System> node test/concurrency_booking.js
Sending concurrent booking requests...

RESULTS:
[
  {
    status: 201,
    data: {
      success: true,
      data: {
        id: 21,
        user_id: 4,
        flight_id: 1,
        seat_id: 1,
        seat_number: '1A',
        status: 'CONFIRMED',
        created_at: '2026-09-14T05:11:41.000Z'
      }
    }
  },
  {
    status: 409,
    data: {
      success: false,
      error: { code: 'SEAT_UNAVAILABLE', message: 'Seat is already booked' }
    }
  }
]
*/