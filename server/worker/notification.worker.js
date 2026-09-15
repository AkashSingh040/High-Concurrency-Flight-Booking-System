require("dotenv").config();

const redisClient =
    require("../src/config/redis");

const {
    BOOKING_STREAM
} = require("../src/events/event.publisher");

const {
    retry
} = require("../src/utils/retry");


const CONSUMER_GROUP =
    "notification-workers";

const CONSUMER_NAME =
    `notification-worker-${process.pid}`;

const DLQ_STREAM =
    "booking-events-dlq";


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


        // Simulated notification
        console.log(
            "Notification sent successfully"
        );
        // //simulate failure by commenting above and uncommeting below
        // throw new Error(
        //     "Simulated email service failure"
        // );
    }
};


const moveToDeadLetterQueue =
    async (message, error) => {

        const {
            eventId,
            eventType,
            occurredAt,
            data
        } = message.message;


        await redisClient.xAdd(
            DLQ_STREAM,
            "*",
            {
                originalMessageId:
                    String(message.id),

                eventId:
                    String(eventId),

                eventType:
                    String(eventType),

                occurredAt:
                    String(occurredAt),

                data:
                    String(data),

                error:
                    String(error.message),

                failedAt:
                    new Date().toISOString()
            }
        );


        console.log(
            `Moved event ${eventId} to DLQ`
        );
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

                    await retry(
                        () =>
                            processEvent(
                                message
                            ),
                        3,
                        1000
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
                        `Event failed after retries: ${message.id}`
                    );


                    console.error(
                        error.message
                    );


                    await moveToDeadLetterQueue(
                        message,
                        error
                    );


                    await redisClient.xAck(
                        BOOKING_STREAM,
                        CONSUMER_GROUP,
                        message.id
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