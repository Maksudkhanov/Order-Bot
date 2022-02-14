const { InputFile } = require('grammy');
const productPrice = require('../static/productPrice');
const { dish } = require('../ui/ui');

function proccessOrder(ctx, word) {
    switch (word) {
        case "plus":
          ctx.session.order.amount = ctx.session.order.amount ? setAmount(ctx, 1) : 1;
          setPrice(ctx)
          ctx.editMessageMedia(
            message(ctx),
            { reply_markup: dish(ctx) }
          );
          break;
        case "minus":
          setAmount(ctx, - 1)
          setPrice(ctx)
          if(ctx.session.order.amount < 0) {
            return ctx.session.order.amount=0
          }
    
          ctx.editMessageMedia(
            message(ctx),
            { reply_markup: dish(ctx) }
          );
          break;
    
        default:
          break;
      }
}

function setPrice(ctx) {
  ctx.session.order.sum = ctx.session.order.amount * productPrice
}

function setAmount(ctx, number) {
  return ctx.session.order.amount = ctx.session.order.amount + number
}

const message = (ctx) => {
  return  {
    type: "photo",
    media:
    new InputFile("src/static/product.jpg"),
    caption:
    ctx.i18n.t("amount")+': ' +
    ctx.session.order.amount +
    '\n'+ctx.i18n.t("sum")+': ' +
    ctx.session.order.sum + ' '+ctx.i18n.t("currency"),
  }
 
} 

module.exports = {
    proccessOrder,
    message
}