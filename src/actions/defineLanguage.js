const { getWord } = require('../utils/getWord');

function defineLanguage(ctx) {
  const selectedLanguage = getWord(ctx);
  return selectedLanguage
}

module.exports = {
  defineLanguage,
};
