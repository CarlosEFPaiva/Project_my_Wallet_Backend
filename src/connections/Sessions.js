import connection from "../database/database.js";

async function insertNewSession(userId, token ) {
    await connection.query(`
        INSERT INTO sessions
            (user_id, token) 
        VALUES ($1, $2);`,
            [userId, token]
    )
}

async function getUserSession(token) {
    const result = await connection.query(`
        SELECT * FROM sessions
        WHERE token = $1;
    `, [token]);
    return result.rows[0];
}

async function getUserName(token) {
    const result = await connection.query(`
        SELECT 
            users.name 
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE token = $1;
    `, [token]);
    return result.rows[0]?.name;
}

export {
    insertNewSession,
    getUserSession,
    getUserName
}