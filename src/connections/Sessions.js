import connection from "../database.js";

async function insertNewSession(userId, token ) {
    await connection.query(`
        INSERT INTO sessions
            (user_id, token) 
        VALUES ($1, $2);`,
            [userId, token]
    )
}

async function getUserId(token) {
    const result = await connection.query(`
        SELECT * FROM sessions
        WHERE token = $1;
    `, [token]);
    return result.rows[0];
}

export {
    insertNewSession,
    getUserId,
}