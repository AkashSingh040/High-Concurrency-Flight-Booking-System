const sendBookingConfirmation = async ({
    bookingId,
    userId,
    flightId,
    seatId
}) => {

    console.log(
        `Sending booking confirmation for booking ${bookingId}`
    );

    console.log(
        `User: ${userId}`
    );

    console.log(
        `Flight: ${flightId}`
    );

    console.log(
        `Seat: ${seatId}`
    );


    // Simulated email/SMS provider
    console.log(
        "Notification sent successfully"
    );
};


module.exports = {
    sendBookingConfirmation
};