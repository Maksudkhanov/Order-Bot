
async function backTo(ctx, word) {
    switch (word) {
        case "main":
            return ctx.editMessageText(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
                .catch(() => {
                    ctx.deleteMessage();
                    ctx.reply(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
                })

        case "withClean":
            ctx.editMessageText(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
            ctx.session.order = {}
            return

        case "withPayment":
            await ctx.deleteMessage();
            await ctx.deleteMessage();
            ctx.reply(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
            
        default:
            break;
    }
}

module.exports = {
    backTo
}


