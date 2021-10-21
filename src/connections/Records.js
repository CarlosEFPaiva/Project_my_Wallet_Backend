import connection from "../database.js";

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
}