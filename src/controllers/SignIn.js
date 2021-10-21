import { insertNewSession } from "../connections/Sessions.js";
import { getUsers } from "../connections/Users.js";
import { isPasswordCorrect } from "../utils/External Libs/Encrypting.js";
import { generateToken } from "../utils/External Libs/TokenGeneration.js";
import { areSignInInputsValid } from "../utils/External Libs/Validation.js";

async function postSignIn(req, res) {
    const email = req.body.email?.toLowerCase();
    const password = req.body.password;

    if (!areSignInInputsValid({email,password})) {
        return res.status(400).send("Error with inputs validation");
    }
    try {
        const savedUser = (await getUsers({email}))[0];
        if (!savedUser) {
            return res.status(404).send("Email was not found");
        }
        if(!isPasswordCorrect(password, savedUser.password)) {
            return res.status(401).send("Incorrect password");
        }
        const token = generateToken()
        await insertNewSession(savedUser.id, token);
        res.send({token});

    } catch (error) {
        res.sendStatus(500)
    }

}

export {
    postSignIn
}