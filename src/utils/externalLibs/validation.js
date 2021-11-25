import joi from 'joi';

function areSignUpInputsValid(newSignUp) {
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(20)
            .required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    });

    return !(schema.validate(newSignUp)).error;
}

function areSignInInputsValid(newSignIn) {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    });
    return !(schema.validate(newSignIn)).error;
}

function areNewEntryInputsValid(newEntry) {
    const schema = joi.object({
        description: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(40)
            .required(),
        value: joi.number().integer().min(1).required(),
        type: joi.number().integer().min(0).max(1)
            .required(),
    });
    return !(schema.validate(newEntry)).error;
}

export {
    areSignUpInputsValid,
    areSignInInputsValid,
    areNewEntryInputsValid,
};
