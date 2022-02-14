const User = require('../../models/User');

async function setUserLanguage(telegramId, language) {

    await User.findOneAndUpdate(
      { telegramId: telegramId },
      { language: language }
    )
    .catch((error) => {
      console.error(error.message);
  });
    return
}

module.exports = {
  setUserLanguage
}

