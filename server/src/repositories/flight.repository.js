const pool = require("../config/db");


const findAll = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM flights"
    );

    return rows;
};


const findById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM flights WHERE id = ?",
        [id]
    );

    return rows[0];
};


const create = async (flightData) => {
    const {
        flight_number,
        airline,
        departure_airport_id,
        arrival_airport_id,
        departure_time,
        arrival_time,
        price
    } = flightData;

    const [result] = await pool.query(
        `INSERT INTO flights
        (
            flight_number,
            airline,
            departure_airport_id,
            arrival_airport_id,
            departure_time,
            arrival_time,
            price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            flight_number,
            airline,
            departure_airport_id,
            arrival_airport_id,
            departure_time,
            arrival_time,
            price
        ]
    );

    return findById(result.insertId);
};


const update = async (id, flightData) => {
    const {
        flight_number,
        airline,
        departure_airport_id,
        arrival_airport_id,
        departure_time,
        arrival_time,
        price
    } = flightData;

    const [result] = await pool.query(
        `UPDATE flights
        SET
            flight_number = ?,
            airline = ?,
            departure_airport_id = ?,
            arrival_airport_id = ?,
            departure_time = ?,
            arrival_time = ?,
            price = ?
        WHERE id = ?`,
        [
            flight_number,
            airline,
            departure_airport_id,
            arrival_airport_id,
            departure_time,
            arrival_time,
            price,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return findById(id);
};


const patch = async (id, flightData) => {

    const fields = [];
    const values = [];

    const allowedFields = [
        "flight_number",
        "airline",
        "departure_airport_id",
        "arrival_airport_id",
        "departure_time",
        "arrival_time",
        "price"
    ];

    for (const field of allowedFields) {

        if (flightData[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(flightData[field]);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const [result] = await pool.query(
        `UPDATE flights
        SET ${fields.join(", ")}
        WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return findById(id);
};


const deleteFlight = async (id) => {

    const [result] = await pool.query(
        "DELETE FROM flights WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
};


module.exports = {
    findAll,
    findById,
    create,
    update,
    patch,
    deleteFlight
};