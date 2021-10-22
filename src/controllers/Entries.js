import { getUserEntries, insertNewRecord } from "../connections/Records.js";
import { getUserName, getUserSession } from "../connections/Sessions.js";
import { areNewEntryInputsValid } from "../utils/External Libs/Validation.js";

async function getUserNameAndEntries(req, res) {
    const token = req.headers.authorization?.replace('Bearer ','');
    if(!token) {
        return res.status(401).send("Token is required for access");
    }
    try {
        const userName = await getUserName(token);
        if (!userName) {
            return res.status(404).send("No session was found for that token");
        }
        const userEntries = await getUserEntries(token);
        res.send({name: userName, entries: userEntries});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postNewEntry(req, res) {
    const token = req.headers.authorization?.replace('Bearer ','');
    if(!token) {
        return res.status(401).send("Token is required for access");
    }
    const {
        description,
        type,
        value
    } = req.body

    if (!areNewEntryInputsValid({description, type, value})) {
        return res.status(400).send("Error with inputs validation");
    }
    try {
        const user = await getUserSession(token);
        if (!user) {
            return res.status(404).send("No session was found for that token");
        }
        const userId = user["user_id"];
        const todaysDate = new Date();
        await insertNewRecord({userId, date: todaysDate, description, type, value});
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    postNewEntry,
    getUserNameAndEntries,
}