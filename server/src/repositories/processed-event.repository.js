const pool = require("../config/db");


const findByEventId = async (eventId) => {

    const [rows] = await pool.query(
        `SELECT event_id, event_type, processed_at
         FROM processed_events
         WHERE event_id = ?`,
        [eventId]
    );

    return rows[0];
};


const markProcessed = async ({
    eventId,
    eventType
}) => {

    await pool.query(
        `INSERT INTO processed_events
        (event_id, event_type)
        VALUES (?, ?)`,
        [eventId, eventType]
    );
};


module.exports = {
    findByEventId,
    markProcessed
};