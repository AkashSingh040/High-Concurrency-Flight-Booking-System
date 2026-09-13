const pool = require("../config/db");

const findById = async (id) => {

    const [rows] = await pool.query(
        `SELECT *
         FROM seats
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};

module.exports = {
    findById
};