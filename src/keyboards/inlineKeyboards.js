const { InlineKeyboard } = require("grammy")

const start = new InlineKeyboard()
    .text("๐บ๐ฟ O'zbek", "lang.uz")
    .row()
    .text("๐ท๐บ ะ ัััะบะธะน", "lang.ru");

const main = (ctx) => {
    return new InlineKeyboard()
        .text(ctx.i18n.t("order"), "order").row()
        .text(ctx.i18n.t("historyOfOrders"), "historyOfOrders").row()
        .text(ctx.i18n.t("settings"), "settings")
}

const dish = (ctx) => {
    return new InlineKeyboard()
        .text("โ", "count.minus")
        .text("โ", "count.plus").row()
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
        .text("๐บ๐ฟ O'zbek", "lang.re.uz").row()
        .text("๐ท๐บ ะ ัััะบะธะน", "lang.re.ru").row()
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
