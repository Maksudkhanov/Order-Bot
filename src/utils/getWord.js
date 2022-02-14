function getWord(ctx) {

    const [trash, word1, word2] = ctx.match.input.split(".");
    
    return (word2 === undefined) ?  word1 : word2
}

module.exports = {
    getWord
}