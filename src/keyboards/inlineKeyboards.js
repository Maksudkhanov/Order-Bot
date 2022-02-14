const { InlineKeyboard } = require("grammy")

const start = new InlineKeyboard()
    .text("🇺🇿 O'zbek", "lang.uz")
    .row()
    .text("🇷🇺 Русский", "lang.ru");

const main = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("order"), "order").row()
        .text(ctx.i18n.t("historyOfOrders"), "historyOfOrders").row()
        .text(ctx.i18n.t("settings"), "settings")
}

const dish = (ctx) => {
    return new InlineKeyboard()
        .text("➖", "count.minus")
        .text("➕", "count.plus").row()
        .text(ctx.i18n.t("buy"), "buy").row()
        .text(ctx.i18n.t("back"), "backto.main")
}

const back = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("back"), "backto.main")
}

const backFromNumber = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("back"), "backfrom.number")
}

const backWithClean = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("back"), "backto.withClean")
}

const basket = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("cleanBasket"), "cleanBasket").row()
        .text(ctx.i18n.t("back"), "backto.main")
}

const settings = (ctx) => {
    return new InlineKeyboard()
        .text("🇺🇿 O'zbek", "lang.re.uz").row()
        .text("🇷🇺 Русский", "lang.re.ru").row()
        .text(ctx.i18n.t("back"), "backto.main")
}


const paymentType = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("cash"), "payment.cash").row()
        .text(ctx.i18n.t("card"), "payment.card").row()
        .text(ctx.i18n.t("cancel"), "backto.withClean")
}

const userPhoneNumber = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("yes"), "phoneNumber.yes")
        .text(ctx.i18n.t("no"), "phoneNumber.no").row()
        .text(ctx.i18n.t("back"), "order")

}

module.exports = {
    start,
    main,
    dish,
    back,
    basket,
    settings,
    paymentType,
    userPhoneNumber,
    backWithClean,
    backFromNumber
};
