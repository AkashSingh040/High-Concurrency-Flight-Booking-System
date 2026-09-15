const redisClient =
    require("../config/redis");

const BOOKING_STREAM =
    "booking-events";

const publishBookingEvent = async (event) => {
    // console.log("BOOKING EVENT:", event);
    await redisClient.xAdd(
        BOOKING_STREAM,
        "*",
        {
            eventId: event.eventId,
            eventType: event.eventType,
            occurredAt: event.occurredAt,
            data: JSON.stringify(event.data)
        }
    );

    console.log(
        `Published event: ${event.eventId}`
    );
};

module.exports = {
    publishBookingEvent,
    BOOKING_STREAM
};