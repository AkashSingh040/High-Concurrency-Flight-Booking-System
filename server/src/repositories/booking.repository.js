const create = async (connection,{
    userId,
    flightId,
    seatId,
    seatNumber
}) => {

    const [result] = await connection.query(
        `INSERT INTO bookings
        (
            user_id,
            flight_id,
            seat_id,
            seat_number
        )
        VALUES (?, ?, ?, ?)`,
        [
            userId,
            flightId,
            seatId,
            seatNumber
        ]
    );

    const [rows] = await connection.query(
        `SELECT *
         FROM bookings
         WHERE id = ?`,
        [result.insertId]
    );

    return rows[0];
};

module.exports = {
    create
};