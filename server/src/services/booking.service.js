const pool=require("../config/db");
const bookingRepository = require("../repositories/booking.repository");
const seatRepository = require("../repositories/seat.repository");
const {createRequestFingerprint}=require("../utils/idempotency");


const createBooking = async ({
    userId,
    flightId,
    seatId,
    idempotencyKey
}) => {

    //create fingerprint
    const requestFingerprint=createRequestFingerprint({
        flightId,seatId
    });
    const existingBooking =
        await bookingRepository.findByIdempotencyKey(
            pool,
            userId,
            idempotencyKey
        );


    if (existingBooking) {

        // Same key but different request
        if (
            existingBooking.request_fingerprint !==
            requestFingerprint
        ) {

            const error = new Error(
                "Idempotency key was already used for a different request"
            );

            error.statusCode = 409;
            error.code = "IDEMPOTENCY_KEY_REUSED";

            throw error;
        }

        return {
            created: false,
            booking: existingBooking
        };
    }

    const connection=await pool.getConnection();

    try{
        await connection.beginTransaction();//start isolated transaction
        
        const seat=await seatRepository.findByIdForUpdate(connection,seatId);

        if (seat.status !== "AVAILABLE") {
            const error = new Error("Seat is already booked");
            error.statusCode = 409;
            error.code = "SEAT_UNAVAILABLE";
            throw error;
        }

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

        const booking = await bookingRepository.create(connection,{
            userId,
            flightId,
            seatId,
            seatNumber: seat.seat_number,
            idempotencyKey,
            requestFingerprint
        });

        const updatedRows=await seatRepository.updateStatus(connection,seatId,"BOOKED");
        
        if(updatedRows!==1){
            const error=new Error("Failed to reserve seat");
            error.statusCode=500;
            error.code="SEAT_UPDATE_FAILED";
            throw error;
        }

        await connection.commit();
        return booking;

    } catch(error){

        await connection.rollback();
        if (error.code === "ER_DUP_ENTRY") {

            const existingBooking =
                await bookingRepository.findByIdempotencyKey(
                    pool,
                    userId,
                    idempotencyKey
                );


            if (existingBooking) {

                if (
                    existingBooking.request_fingerprint !==
                    requestFingerprint
                ) {

                    const conflict =
                        new Error(
                            "Idempotency key was already used for a different request"
                        );

                    conflict.statusCode = 409;
                    conflict.code =
                        "IDEMPOTENCY_KEY_REUSED";

                    throw conflict;
                }


                return {
                    created: false,
                    booking: existingBooking
                };
            }
        }


        throw error;

    } finally {

        connection.release();

    }
};

module.exports = {
    createBooking
};