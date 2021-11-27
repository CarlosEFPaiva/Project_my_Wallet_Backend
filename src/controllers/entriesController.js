import * as entriesService from '../services/entriesService.js';

import { areNewEntryInputsValid } from '../utils/externalLibs/validation.js';

async function getUserNameAndEntries(req, res) {
    const { user, token } = res.locals;
    try {
        const userEntries = await entriesService.getUserEntries({ token });
        return res.send({ name: user.name, entries: userEntries });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function postNewEntry(req, res) {
    const { user } = res.locals;
    const {
        description,
        type,
        value,
    } = req.body;
    if (!areNewEntryInputsValid({ description, type, value })) {
        return res.status(400).send('Error with inputs validation');
    }
    try {
        await entriesService.insertNewEntry({ userId: user.id, description, type, value });
        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    postNewEntry,
    getUserNameAndEntries,
};
