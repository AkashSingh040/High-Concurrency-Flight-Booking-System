const crypto=require("crypto");

const createBookingCreatedEvent=({
    bookingId,userId,flightId,seatId
})=>{
    return {
        eventId:crypto.randomUUID(),
        eventType:"BOOKING_CREATED",
        occuredAt:new Date().toISOString,

        data:{
            bookingId,userId,flightId,seatId
        }
    };
};

module.exports={
    createBookingCreatedEvent
}