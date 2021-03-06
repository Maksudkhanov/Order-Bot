const OnLocation = (ctx) => {
  switch (ctx.session.flag) {
    case "location":
      ctx.session.order.location = ctx.message.location;
      ctx.session.flag = "name";
      return ctx.reply(ctx.i18n.t("askForName"), {
        reply_markup: { remove_keyboard: true },
      });

    default:
      return;
  }
};

module.exports = {
  OnLocation,
};
