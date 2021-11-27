import * as usersRepository from '../repositories/usersRepository.js';
import * as sessionsRepository from '../repositories/sessionsRepository.js';
import { isPasswordCorrect, encryptPassword } from '../utils/externalLibs/encrypting.js';
import { generateToken } from '../utils/externalLibs/tokenGeneration.js';
import { capitalizeFirstLetters } from '../utils/sharedFunctions.js';

async function getUserToken({ email, password }) {
    const lowerCaseEmail = email.toLowerCase();
    const savedUser = (await usersRepository.getUser({ email: lowerCaseEmail }));
    if (!savedUser) {
        return '';
    }
    if (!isPasswordCorrect(password, savedUser.password)) {
        return '';
    }
    const token = generateToken();
    await sessionsRepository.insertNewSession({ userId: savedUser.id, token });
    return token;
}

async function createNewUser({ name, email, password }) {
    const adjustedName = capitalizeFirstLetters(name);
    const lowerCaseEmail = email.toLowerCase();
    const isEmailRegistered = await usersRepository.getUser({ email: lowerCaseEmail });
    if (isEmailRegistered) {
        return '';
    }
    return usersRepository.insertNewUser({
        name: adjustedName,
        email: lowerCaseEmail,
        password: encryptPassword(password, 10),
    });
}

export {
    getUserToken,
    createNewUser,
};
