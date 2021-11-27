import * as usersService from '../services/usersService.js';

import { areSignUpInputsValid, areSignInInputsValid } from '../utils/externalLibs/validation.js';

async function postSignIn(req, res) {
    const { email, password } = req.body;
    if (!areSignInInputsValid({ email, password })) {
        return res.status(400).send('Error with inputs validation');
    }
    try {
        const token = await usersService.getUserToken({ email, password });
        if (!token) {
            return res.status(401).send('Email and/or password are incorrect');
        }
        return res.send({ token });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function postNewSignUp(req, res) {
    const { name, email, password } = req.body;
    if (!areSignUpInputsValid({ name, email, password })) {
        return res.status(400).send('Error with inputs validation');
    }
    try {
        const addedUser = await usersService.createNewUser({ name, email, password });
        if (!addedUser) {
            return res.status(409).send('This email is already registered');
        }
        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    postNewSignUp,
    postSignIn,
};
