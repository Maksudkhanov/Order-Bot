const User = require('../models/User');
const { location } = require('../keyboards/customKeyboard');

const OnPhoneNumber = async (ctx) => {
  switch (ctx.session.flag) {
    case 'phone':
      ctx.session.flag = 'location'
      ctx.session.user.phoneNumber
        = ctx.session.order.phoneNumber
        = ctx.message.text || ctx.message.contact.phone_number

      await User.findOneAndUpdate({ telegramId: ctx.session.user.telegramId }, 
        { phoneNumber: ctx.session.user.phoneNumber })
        
      return ctx.reply(ctx.i18n.t("askForLocation"), {
        reply_markup: location(ctx)

      })

    default:
      return;
  }
}

module.exports = {
  OnPhoneNumber
}
