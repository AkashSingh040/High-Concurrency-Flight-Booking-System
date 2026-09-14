const findById = async (connection,id) => {

    const [rows] = await connection.query(
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