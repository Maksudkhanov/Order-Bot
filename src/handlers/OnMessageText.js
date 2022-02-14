const { chooseTypeOfPayment } = require('../actions/chooseTypeOfPayment');

const OnMessageText = (ctx) => {
     switch (ctx.session.flag) {
        case "name":
          ctx.session.order.username = ctx.message.text;
          return chooseTypeOfPayment(ctx,{
            reply_markup: { remove_keyboard: true },
          })
    
        default:
          return;
      }
}

module.exports = {
    OnMessageText
}