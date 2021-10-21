import bcrypt from 'bcrypt';

function encryptPassword(password, salts) {
    return bcrypt.hashSync(password, salts);
}

function comparePassword(password, encryptedPassword) {
    return bcrypt.compareSync(password, encryptedPassword);
}

export {
    encryptPassword,
    comparePassword,
}