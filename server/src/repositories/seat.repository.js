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

    const [result]=await connection.query(
        `UPDATE seats
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );
    return result.affectedRows;//to verify state transaction actually happened , using service
};


module.exports = {
    findByIdForUpdate,
    updateStatus
};