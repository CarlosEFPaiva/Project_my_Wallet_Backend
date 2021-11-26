import faker from 'faker';

function getToken() {
    return faker.datatype.uuid();
}

function getNumber(min, max) {
    return faker.helpers.regexpStyleStringParse(`[${min}-${max}]`);
}

function getStrongPassword() {
    const getUpperCaseLetter = () => faker.random.alpha().toUpperCase();
    const getLowerCaseLetter = () => faker.random.alpha().toLowerCase();
    const getSymbol = () => faker.helpers.shuffle(['@', '$', '!', '%', '*', '?', '&'])[0];

    const characterFunctions = [getNumber, getUpperCaseLetter, getLowerCaseLetter, getSymbol];
    const passwordArray = [];

    for (let i = 0; i < 4; i++) {
        passwordArray.push(characterFunctions[i](1, 9));
    }
    for (let i = 0; i < getNumber(4, 16); i++) {
        const characterIndex = getNumber(0, 3);
        passwordArray.push(characterFunctions[characterIndex](1, 9));
    }
    return faker.helpers.shuffle(passwordArray).join('');
}

function getUser() {
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: getStrongPassword(),
    };
}

function getEntry(userId) {
    return {
        userId,
        date: faker.date.between('12/31/2000', '12/31/2020'),
        description: faker.lorem.words(3),
        type: getNumber(0, 1),
        value: getNumber(1, 10000000),
    };
}

export {
    getToken,
    getUser,
    getStrongPassword,
    getEntry,
};
