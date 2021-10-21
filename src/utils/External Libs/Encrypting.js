import bcrypt from 'bcrypt';

function encryptPassword(password, salts) {
    return bcrypt.hashSync(password, salts);
}

function isPasswordCorrect(password, encryptedPassword) {
    return bcrypt.compareSync(password, encryptedPassword);
}

export {
    encryptPassword,
    isPasswordCorrect,
}