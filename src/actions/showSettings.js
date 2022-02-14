const { settings } = require('../keyboards/ui')

function showSettings(ctx) {
    ctx.editMessageText(ctx.i18n.t("changeLanguage"), {reply_markup: settings(ctx)}).catch((err) => {
        return
    })
}

module.exports = {
    showSettings
}