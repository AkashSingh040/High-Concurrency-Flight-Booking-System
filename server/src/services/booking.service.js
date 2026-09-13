const bookingRepository = require("../repositories/booking.repository");
const seatRepository = require("../repositories/seat.repository");

const createBooking = async ({
    userId,
    flightId,
    seatId
}) => {

    const seat = await seatRepository.findById(seatId);

    if (!seat) {
        throw new Error("Seat not found");
    }

    if (seat.flight_id !== Number(flightId)) {
        throw new Error("Seat does not belong to this flight");
    }

    if (seat.status === "BOOKED") {
        throw new Error("Seat is already booked");
    }

    const booking = await bookingRepository.create({
        userId,
        flightId,
        seatId,
        seatNumber: seat.seat_number
    });

    return booking;
};

module.exports = {
    createBooking
};