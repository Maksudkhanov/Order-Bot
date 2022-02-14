const { main } = require('../keyboards/ui');

function greetUser(ctx) {

    ctx.reply(ctx.i18n.t("hey"), { reply_markup: main(ctx) });
}

module.exports = {
    greetUser
}