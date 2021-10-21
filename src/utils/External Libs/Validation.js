import joi from "joi";

function areSignUpInputsValid(newSignUp) {
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
    })

    return !(schema.validate(newSignUp)).error;
}

export {
    areSignUpInputsValid,
}