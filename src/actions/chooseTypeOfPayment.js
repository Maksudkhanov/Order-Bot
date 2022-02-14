const { paymentType } = require('../keyboards/inlineKeyboards');

function chooseTypeOfPayment(ctx) {
    return ctx.reply(
        ctx.i18n.t("yourOrder") + "\n" + ctx.i18n.t("amount") + ": " +
        ctx.session.order.amount +
        "\n" + ctx.i18n.t("sum") + ': ' + ctx.session.order.sum + ' ' + ctx.i18n.t("currency") +

        "\n\n" + ctx.i18n.t("chooseTypeOfPayment"),
        { reply_markup: paymentType(ctx) }
      );
}

module.exports = {
    chooseTypeOfPayment
}