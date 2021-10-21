function capitalizeFirstLetters(name) {
    if (!name) {
        return undefined;
    }
    const arrayOfWords = name.split(" ");
    const capitalizedArray = arrayOfWords.map( word => {
        const lowerCaseWord = word.toLowerCase();
        return lowerCaseWord[0].toUpperCase() + lowerCaseWord.substring(1);
    })
    return capitalizedArray.join(" ");
}

export {
    capitalizeFirstLetters,
}