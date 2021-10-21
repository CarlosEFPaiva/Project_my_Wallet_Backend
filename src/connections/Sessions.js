import connection from "../database.js";

async function insertNewSession(userId, token ) {
    await connection.query(`
        INSERT INTO sessions
            (user_id, token) 
        VALUES ($1, $2)`,
            [userId, token]
    )
}

export {
    insertNewSession,
}