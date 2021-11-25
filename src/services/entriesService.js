import * as usersRepository from '../repositories/usersRepository.js';
import * as recordsRepository from '../repositories/recordsRepository.js';

async function getUserData(authorization) {
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
        return {};
    }
    const user = await usersRepository.getUser({ token });
    return { token, user };
}

async function getUserEntries({ token }) {
    return recordsRepository.getUserEntries({ token });
}

async function insertNewEntry({ userId, description, type, value }) {
    const todaysDate = new Date();
    return recordsRepository.insertNewRecord({
        userId,
        date: todaysDate,
        description,
        type,
        value,
    });
}
export {
    getUserData,
    insertNewEntry,
    getUserEntries,
};
