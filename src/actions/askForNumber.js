const { number } = require('../keyboards/customKeyboard');

function askForNumber(ctx) {
    return ctx.reply(ctx.i18n.t("askForNumber"), {
        reply_markup:
        {
            resize_keyboard: true,
            // one_time_keyboard: true,
            keyboard: number(ctx).build()
        },
    });
}

module.exports = {
    askForNumber
}