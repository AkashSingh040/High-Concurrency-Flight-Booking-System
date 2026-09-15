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

const search = async ({
    from,
    to,
    page = 1,
    limit = 10
}) => {

    const conditions = [];
    const values = [];

    if (from) {
        conditions.push("dep.code = ?");
        values.push(from);
    }

    if (to) {
        conditions.push("arr.code = ?");
        values.push(to);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const offset =
        (Number(page) - 1) * Number(limit);


    const [rows] = await pool.query(
        `SELECT
            f.id,
            f.flight_number,
            f.airline,
            dep.code AS from_airport,
            dep.city AS from_city,
            arr.code AS to_airport,
            arr.city AS to_city,
            f.departure_time,
            f.arrival_time,
            f.price
        FROM flights f
        JOIN airports dep
            ON f.departure_airport_id = dep.id
        JOIN airports arr
            ON f.arrival_airport_id = arr.id
        ${whereClause}
        ORDER BY f.departure_time
        LIMIT ? OFFSET ?`,
        [
            ...values,
            Number(limit),
            Number(offset)
        ]
    );


    const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total
        FROM flights f
        JOIN airports dep
            ON f.departure_airport_id = dep.id
        JOIN airports arr
            ON f.arrival_airport_id = arr.id
        ${whereClause}`,
        values
    );


    const total = Number(countRows[0].total);


    return {
        data: rows,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(
                total / Number(limit)
            )
        }
    };
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    patch,
    deleteFlight,
    search
};