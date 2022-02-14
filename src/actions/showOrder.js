const { InputFile } = require('grammy');
const productPrice = require('../static/productPrice');
const { dish } = require('../keyboards/ui');

function showOrder(ctx) {
      if(ctx.session.order.amount === undefined || ctx.session.order.amount ===0) {
        ctx.session.order.sum = ctx.session.order.amount = 0
      }
     ctx.replyWithPhoto(
      new InputFile("src/static/product.jpg"),
      {
        caption:
          ctx.i18n.t("amount")+': ' +
          ctx.session.order.amount +
          '\n'+ctx.i18n.t("sum")+': ' +
          ctx.session.order.sum +' '+ctx.i18n.t("currency"),
        reply_markup: dish(ctx),
      }
    );
}

module.exports = {
    showOrder
}