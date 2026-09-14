const create = async (connection,{
    userId,
    flightId,
    seatId,
    seatNumber,
    idempotencyKey,
    requestFingerprint
}) => {

    const [result] = await connection.query(
        `INSERT INTO bookings
        (
            user_id,
            flight_id,
            seat_id,
            seat_number,
            idempotency_key,
            request_fingerprint
        )
        VALUES (?, ?, ?, ?,?,?)`,
        [
            userId,
            flightId,
            seatId,
            seatNumber,
            idempotencyKey,
            requestFingerprint
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

const findByIdempotencyKey = async (
    db,
    userId,
    idempotencyKey
) => {

    const [rows] = await db.query(
        `SELECT *
         FROM bookings
         WHERE user_id = ?
         AND idempotency_key = ?`,
        [userId, idempotencyKey]
    );

    return rows[0];
};

module.exports = {
    create,
    findByIdempotencyKey
};