import { capitalizeFirstLetters } from "../utils/sharedFunctions.js";
import { areSignUpInputsValid } from "../utils/External Libs/Validation.js";
import { getUsers, insertNewUser } from "../connections/Users.js";
import { encryptPassword } from "../utils/External Libs/Encrypting.js";

async function postNewSignUp(req, res) {
    const name = capitalizeFirstLetters(req.body.name);
    const email = req.body.email?.toLowerCase();
    const password = req.body.password;

    if (!areSignUpInputsValid({name,email,password})) {
        return res.status(400).send("Error with inputs validation");
    }

    try {
        const isEmailRegistered = (await getUsers({email})).length;
        if ( isEmailRegistered ) {
            return res.status(409).send("This email is already registered");
        }
        await insertNewUser(name, email, encryptPassword(password, 10));
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500); 
    }
}

export {
    postNewSignUp,
}