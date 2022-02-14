const { basket } = require('../ui/ui');

function cleanBasket(ctx) {
    ctx.session.count = 0;
    ctx.editMessageText(
      "Количество порций: " + ctx.session.count + "\nЦена: " + ctx.session.count,
      { reply_markup: basket(ctx) }
    );
}

module.exports = {
    cleanBasket
}