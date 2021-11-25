import connection from '../database/database.js';

async function getUser({ email, id, token }) {
    const queryParams = [];
    let queryText = `
        SELECT
            users.*
        FROM users`;
    if (token) {
        queryText += ' JOIN sessions ON users.id = sessions.user_id';
    }

    queryText += ' WHERE 1=1';

    if (email) {
        queryParams.push(email);
        queryText += ` AND users.email = $${queryParams.length}`;
    }
    if (id) {
        queryParams.push(id);
        queryText += ` AND users.id = $${queryParams.length}`;
    }
    if (token) {
        queryParams.push(token);
        queryText += ` AND sessions.token = $${queryParams.length}`;
    }
    const result = await connection.query(`${queryText};`, queryParams);
    return result.rows[0];
}

async function insertNewUser({ name, email, password }) {
    return connection.query(`
    INSERT INTO users 
    (name, email, password) 
    VALUES ($1, $2, $3) RETURNING *;`, [name, email, password]);
}

export {
    getUser,
    insertNewUser,
};
