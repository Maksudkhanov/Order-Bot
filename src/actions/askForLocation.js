const { location } = require('../keyboards/customKeyboard');

function askForLocation(ctx) {
    return ctx.reply(ctx.i18n.t("askForLocation"), {
        reply_markup:
        {
            resize_keyboard: true,
            // one_time_keyboard: true,
            keyboard: location(ctx).build()
        },
    });
}

module.exports = {
    askForLocation
}