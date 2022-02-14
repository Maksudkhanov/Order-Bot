const moment = require('moment')
const { back } = require('../keyboards/inlineKeyboards')

function showHistoryOfOrders(ctx, orders, page) {
    if (orders.length === 0) {
        return ctx.editMessageText(ctx.i18n.t("noOrders"), { reply_markup: back(ctx) })
    }

    if (orders.length > 0 && orders.length < 3) {
        keyboard = back(ctx)
    }
    
    let { message, keyboard } = orderPage(ctx, orders, page)

    return ctx.editMessageText(message, { reply_markup: keyboard })
}

module.exports = {
    showHistoryOfOrders
}
const orderPage = (ctx, list, page = 0) => {
    page = parseInt(page)
    const limit = 3
    let message = '';
    let btns = []
    
    if (page < 0) {
      page = Math.ceil(list.length / limit) - 1
    }
  
  
    for (let i = 0; i < limit; i++) {
      const order = list[page * limit + i]
      if (order === undefined) {
        break
      }
      message += ctx.i18n.t("amount") + ": " + order.amount + "    " +
        ctx.i18n.t("sum") + ': ' + order.sum + ' ' + ctx.i18n.t("currency") + '\n' +
        ctx.i18n.t("status") + ": " + ctx.i18n.t(`${order.status}`) + '\n' +
        ctx.i18n.t("typeOfPayment") + ': ' + ctx.i18n.t(`${order.typeOfPayment}`) + '\n' +
        ctx.i18n.t("time") + ': ' + moment(order.createdAt).format("DD.MM.YYYY HH:MM") + '\n\n'
  
    }
  
    const next = (page + 1) % (Math.ceil(list.length / limit))
    const prew = (page - 1) % (Math.ceil(list.length / limit))
  
    btns.push([
      { text: ctx.i18n.t("back"), callback_data: `historyOfOrders.${prew}` },
      { text: ctx.i18n.t("next"), callback_data: `historyOfOrders.${next}` }
    ])
  
    btns.push([
      { text: ctx.i18n.t("back"), callback_data: `backto.main` }
    ])
  
    const keyboard = { inline_keyboard: btns }
  
    return {
      message: message,
      keyboard: keyboard
    }
  }