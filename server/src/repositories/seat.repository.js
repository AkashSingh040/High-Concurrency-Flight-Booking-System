const findByIdForUpdate = async (connection,id) => {

    const [rows] = await connection.query(
        `SELECT *
         FROM seats
         WHERE id = ?
         FOR UPDATE`,
        [id]
    );

    return rows[0];
};

const updateStatus = async (connection, id, status) => {

    await connection.query(
        `UPDATE seats
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );
};

module.exports = {
    findByIdForUpdate,
    updateStatus
};