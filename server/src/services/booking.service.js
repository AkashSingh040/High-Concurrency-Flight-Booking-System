const pool=require("../config/db");
const bookingRepository = require("../repositories/booking.repository");
const seatRepository = require("../repositories/seat.repository");

const createBooking = async ({
    userId,
    flightId,
    seatId
}) => {

    const connection=await pool.getConnection();

    try{
        await connection.beginTransaction();//start transaction
        
        const seat=await seatRepository.findById(connection,seatId);
        
        if (!seat) {
        throw new Error("Seat not found");
        }

        if (seat.flight_id !== Number(flightId)) {
            throw new Error("Seat does not belong to this flight");
        }

        if (seat.status === "BOOKED") {
            throw new Error("Seat is already booked");
        }

        const booking = await bookingRepository.create(connection,{
            userId,
            flightId,
            seatId,
            seatNumber: seat.seat_number
        });

        await connection.commit();
        return booking;
    } catch(error){
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createBooking
};