import connection from "../database/database.js";

async function getUsers(queries, limit) {
    const queriesObject = queries ? queries : {};
    const {
        email,
        userId
    } = queriesObject;
    let queryText = `SELECT * FROM users WHERE 1=1`;
    const queryParams = [];

    if (email) {
        queryParams.push(email);
        queryText += `AND email = $${queryParams.length}`
    }
    if (userId) {
        queryParams.push(userId);
        queryText += `AND id = $${queryParams.length}`
    }
    if (limit) {
        queryText += `LIMIT ${limit}`
    } else {
        queryText += `LIMIT 100`
    }

    const users = await connection.query(`${queryText};`, queryParams);
    return users.rows;
}

async function insertNewUser(name, email, password) {
    connection.query(`
    INSERT INTO users 
    (name, email, password) 
    VALUES ($1, $2, $3);`, [name, email, password])
}

export {
    getUsers,
    insertNewUser,
}