const saveOrder = require('../db/queries/saveOrder');
const { backWithClean } = require('../keyboards/inlineKeyboards');

async function concludeOrder(ctx, typeOfPayment) {
    if (typeOfPayment === 'cash') {
        ctx.session.order.status = 'NP'
        await saveOrder(ctx);
        return ctx.editMessageText(message(ctx), { reply_markup: backWithClean(ctx) })
    }

    ctx.deleteMessage()
    await ctx.replyWithInvoice(
        'Payment', ctx.i18n.t("pay"), 'payload',
        '371317599:TEST:1644420941421',
        'UZS', [
        { label: '10', amount: `${ctx.session?.order?.sum}00` }
    ]

    )
    ctx.session.order = {}
}

const message = (ctx) => {
    return ctx.i18n.t("yourOrder") +
    "\n" + ctx.i18n.t("amount") + ": " + ctx.session.order.amount +
    "\n" + ctx.i18n.t("sum") + ': ' + ctx.session.order.sum + ' ' + ctx.i18n.t("currency") +
    "\n\n" + ctx.i18n.t("typeOfPayment") + ": " + ctx.i18n.t(`${ctx.session.order.typeOfPayment}`) +
    '\n' + ctx.i18n.t("status") + ": " + ctx.i18n.t(`${ctx.session.order.status}`)
}
module.exports = {
    concludeOrder
}