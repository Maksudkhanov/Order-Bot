const User = require('../../models/User');

module.exports = async function setUserLanguage(telegramId, language) {
    await User.findOneAndUpdate(
        { telegramId: telegramId },
        { language: language }
      );
}

