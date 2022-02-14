const { userPhoneNumber } = require('../keyboards/inlineKeyboards');

function confirmPhoneNumber(ctx) {
    return ctx.reply(
        ctx.i18n.t("isYourPhoneNumber") + " : " + ctx.session.user.phoneNumber,
        { reply_markup: userPhoneNumber(ctx) }
      );
}

module.exports = {
    confirmPhoneNumber
}