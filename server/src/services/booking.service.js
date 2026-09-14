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
        const error = new Error("Seat not found");
        error.statusCode = 404;
        error.code = "SEAT_NOT_FOUND";
        throw error;
        }

        if (seat.flight_id !== Number(flightId)) {
        const error = new Error("Seat does not belong to this flight");
        error.statusCode = 400;
        error.code = "INVALID_SEAT";
        throw error;
        }

        const availableSeat=await seatRepository.findAvailableSeat(connection,seatId,flightId);

        if(!availableSeat){
            const error=new Error("Seat is already booked");
            error.statusCode=409;
            error.code="SEAT_UNAVAILABLE";
            throw error;
        }

        const booking = await bookingRepository.create(connection,{
            userId,
            flightId,
            seatId,
            seatNumber: availableSeat.seat_number
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