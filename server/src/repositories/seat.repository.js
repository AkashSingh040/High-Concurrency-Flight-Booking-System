const findById = async (connection,id) => {

    const [rows] = await connection.query(
        `SELECT *
         FROM seats
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};

const findAvailableSeat = async (connection, seatId, flightId) => {
    const [rows] = await connection.query(
        `SELECT id, flight_id, seat_number, status
         FROM seats
         WHERE id = ?
         AND flight_id = ?
         AND status = 'AVAILABLE'`,
        [seatId, flightId]
    );

    return rows[0];
};

module.exports = {
    findById,
    findAvailableSeat
};