const { main } = require('../ui/ui');

function greetUser(ctx) {
    
    ctx.reply(ctx.i18n.t("hey"), { reply_markup: main(ctx) });
}

module.exports = {
    greetUser
}