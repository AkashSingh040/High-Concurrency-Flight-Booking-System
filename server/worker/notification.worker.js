require("dotenv").config();

const redisClient =
    require("../src/config/redis");

const {
    BOOKING_STREAM
} = require("../src/events/event.publisher");


const CONSUMER_GROUP =
    "notification-workers";

const CONSUMER_NAME =
    `notification-worker-${process.pid}`;


const processEvent = async (message) => {

    const {
        eventId,
        eventType,
        occurredAt,
        data
    } = message.message;


    console.log(
        "\nProcessing event:",
        eventId
    );

    console.log(
        "Event type:",
        eventType
    );

    console.log(
        "Occurred at:",
        occurredAt
    );


    const bookingData =
        JSON.parse(data);


    if (
        eventType === "BOOKING_CREATED"
    ) {

        console.log(
            `Sending booking confirmation for booking ${bookingData.bookingId}`
        );

        console.log(
            `User: ${bookingData.userId}`
        );

        console.log(
            `Flight: ${bookingData.flightId}`
        );

        console.log(
            `Seat: ${bookingData.seatId}`
        );

        // Simulate email/SMS
        console.log(
            "Notification sent successfully"
        );
    }
};


const startWorker = async () => {

    await redisClient.connect();

    console.log(
        "Notification worker connected to Redis"
    );


    try {

        await redisClient.xGroupCreate(
            BOOKING_STREAM,
            CONSUMER_GROUP,
            "0",
            {
                MKSTREAM: true
            }
        );

        console.log(
            `Created consumer group: ${CONSUMER_GROUP}`
        );

    } catch (error) {

        if (
            error.message.includes(
                "BUSYGROUP"
            )
        ) {

            console.log(
                `Consumer group already exists: ${CONSUMER_GROUP}`
            );

        } else {

            throw error;
        }
    }


    console.log(
        `Consumer: ${CONSUMER_NAME}`
    );


    while (true) {

        const result =
            await redisClient.xReadGroup(
                CONSUMER_GROUP,
                CONSUMER_NAME,
                [
                    {
                        key: BOOKING_STREAM,
                        id: ">"
                    }
                ],
                {
                    COUNT: 10,
                    BLOCK: 5000
                }
            );


        if (!result) {
            continue;
        }


        for (const stream of result) {

            for (
                const message
                of stream.messages
            ) {

                try {

                    await processEvent(
                        message
                    );


                    await redisClient.xAck(
                        BOOKING_STREAM,
                        CONSUMER_GROUP,
                        message.id
                    );


                    console.log(
                        `ACK event: ${message.id}`
                    );

                } catch (error) {

                    console.error(
                        "Event processing failed:",
                        error.message
                    );
                }
            }
        }
    }
};


startWorker().catch((error) => {

    console.error(
        "Worker startup failed:",
        error
    );

    process.exit(1);
});