import connection from "../database.js";

async function getUserEntries(token) {
    const result = await connection.query(`
    SELECT 
        records.date,
        records.description,
        records.type,
        records.value 
    FROM sessions 
    JOIN records ON records.user_id = sessions.user_id
    WHERE sessions.token = $1 ORDER BY records.date DESC;
    `, [token]);
    return result.rows;
}

async function insertNewRecord({userId, date, description, type, value}) {
    await connection.query(`
        INSERT INTO records
            (user_id, date, description, type, value) 
        VALUES ($1, $2, $3, $4, $5);`,
            [userId, date, description, type, value]
    )
}

export {
    insertNewRecord,
    getUserEntries,
}