const crypto=require("crypto");

const createBookingCreatedEvent=({
    bookingId,userId,flightId,seatId
})=>{
    return {
        eventId:crypto.randomUUID(),
        eventType:"BOOKING_CREATED",
        occurredAt:new Date().toISOString(),

        data:{
            bookingId,userId,flightId,seatId
        }
    };
};

module.exports={
    createBookingCreatedEvent
}