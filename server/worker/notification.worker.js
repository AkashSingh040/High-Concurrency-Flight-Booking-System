require("dotenv").config({path: require("path").resolve(__dirname, "../.env")});

const processedEventRepository =
    require("../src/repositories/processed-event.repository");

const {
    sendBookingConfirmation
} = require("../src/services/notification.service");

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


    // Check whether event was already processed
    const existingEvent =
        await processedEventRepository
            .findByEventId(eventId);


    if (existingEvent) {

        console.log(
            `Event ${eventId} already processed. Skipping notification.`
        );

        return;
    }


    const bookingData =
        JSON.parse(data);


    if (
        eventType === "BOOKING_CREATED"
    ) {

        await sendBookingConfirmation({
            bookingId: bookingData.bookingId,
            userId: bookingData.userId,
            flightId: bookingData.flightId,
            seatId: bookingData.seatId
        });
    }


    // Mark event as processed only after
    // notification succeeds
    await processedEventRepository.markProcessed({
        eventId,
        eventType
    });


    console.log(
        `Event ${eventId} marked as processed`
    );
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