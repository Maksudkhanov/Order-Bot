const {
  Bot,
  session,
} = require("grammy");
const { I18n } = require("@grammyjs/i18n");
const token = require("./token");
const { greetUser } = require("./actions/greetUser");
const { getWord } = require("./utils/getWord");
const { showOrder } = require("./actions/showOrder");
const { proccessOrder } = require("./actions/proccessOrder");
const { defineLanguage } = require("./actions/defineLanguage");
const { showSettings } = require("./actions/showSettings");
const { OnPhoneNumber } = require("./handlers/OnPhoneNumber");
const { OnLocation } = require("./handlers/OnLocation");
const User = require("./models/User");
const saveOrder = require("./db/queries/saveOrder");
const { backTo } = require('./actions/backTo');
const { start } = require("./keyboards/inlineKeyboards");
const { getUserOrders } = require('./db/queries/getUserOrders');
const { showHistoryOfOrders } = require('./actions/showHistoryOfOrders');
const { confirmPhoneNumber } = require('./actions/confirmPhoneNumber');
const { askForNumber } = require('./actions/askForNumber');
const { location } = require('./keyboards/customKeyboard');
const { askForLocation } = require('./actions/askForLocation');
const { chooseTypeOfPayment } = require('./actions/chooseTypeOfPayment');
const { concludeOrder } = require('./actions/concludeOrder');
const { OnMessageText } = require('./handlers/OnMessageText');
require("./db/connection");


const i18n = new I18n({
  defaultLanguage: "uz",
  defaultLanguageOnMissing: true,
  directory: "src/locales",
  useSession: true,
});

const bot = new Bot(token);

function initial() {
  const user = {};
  const order = {
    user_id: 0,
    username: "",
    phoneNumber: "",
    amount: 0,
    sum: 0,
    typeOfPayment: "",
  };
  return {
    user,
    order,
  };
}

bot.use(i18n.middleware());
bot.use(session({ initial }));

bot.use(async (ctx, next) => {

  if (!ctx.session.user._id)
    ctx.session.user = await User.findOneAndUpdate(
      { telegramId: ctx.from.id },
      { telegramId: ctx.from.id, }, { new: true, upsert: true }).lean();

  ctx.i18n.languageCode = ctx.session.user.language;

  await next();
});


bot.command("start", async (ctx) => {
  ctx.session.flag = "";

  if (!ctx.session.user.language) {
    return ctx.reply("Tilni tanlang\nВыберите язык", { reply_markup: start });
  }

  return greetUser(ctx);
});


bot.on(":contact", async (ctx) => {
  return OnPhoneNumber(ctx);
});

bot.on("::phone_number", async (ctx) => {
  return OnPhoneNumber(ctx);
});

bot.on(":location", async (ctx) => {
  return OnLocation(ctx);
});

bot.on("message:text", (ctx) => {
  return OnMessageText(ctx)
});

function isStart(word) {
  return !word.includes(".re.");
}

bot.callbackQuery(/lang./, async (ctx) => {
  ctx.answerCallbackQuery();
  ctx.session.user.language = defineLanguage(ctx)
  ctx.i18n.locale(ctx.session.user.language)

  // setUserLanguage(ctx.session.user.telegramId, ctx.session.user.language)

  await User.findOneAndUpdate(
    { telegramId: ctx.session.user.telegramId },
    { language: ctx.session.user.language }
  );

  if (isStart(ctx.match.input)) {
    await ctx.deleteMessage();
    return greetUser(ctx);
  }

  return showSettings(ctx);
});

bot.callbackQuery(/order/, async (ctx) => {
  await ctx.deleteMessage();
  return showOrder(ctx);
});

bot.callbackQuery(/backto./, async (ctx) => {
  ctx.answerCallbackQuery();

  const word = getWord(ctx);
  return backTo(ctx, word)
});


bot.callbackQuery(/historyOfOrders/, async (ctx) => {
  ctx.answerCallbackQuery();

  const page = getWord(ctx);
  const orders = await getUserOrders(ctx.session.user.telegramId)

  return showHistoryOfOrders(ctx, orders, page)
});

bot.callbackQuery(/settings/, async (ctx) => {
  ctx.answerCallbackQuery();
  return showSettings(ctx);
});

bot.callbackQuery(/count./, async (ctx) => {
  ctx.answerCallbackQuery();

  const word = getWord(ctx);
  proccessOrder(ctx, word);
});

bot.callbackQuery(/buy/, async (ctx) => {
  if (!ctx.session.order || ctx.session.order.amount === 0) {
    return ctx.answerCallbackQuery({
      show_alert: true,
      text: ctx.i18n.t("chooseAmount"),
    });
  }
  
  ctx.answerCallbackQuery();

  if (ctx.session.user?.phoneNumber) {
    await ctx.deleteMessage()
    return confirmPhoneNumber(ctx)
  }

  ctx.session.flag = "phone";
  return askForNumber(ctx)
});

bot.callbackQuery(/phoneNumber/, async (ctx) => {
  ctx.answerCallbackQuery();
  const answer = getWord(ctx);


  switch (answer) {
    case "yes":
      await ctx.deleteMessage();
      ctx.session.flag = "location"
      ctx.session.order.phoneNumber = ctx.session.user.phoneNumber
      return askForLocation(ctx)

    case "no":
      ctx.session.flag = "phone";
      ctx.deleteMessage();
      return askForNumber(ctx)

    default:
      return;
  }
});

bot.callbackQuery(/payment/, async (ctx) => {
  ctx.answerCallbackQuery();
  const typeOfPayment = getWord(ctx);
  ctx.session.order.typeOfPayment = typeOfPayment;
  ctx.session.order.user_id = ctx.session.user.telegramId;

  return concludeOrder(ctx, ctx.session.order.typeOfPayment)
});

bot.on(":successful_payment", async (ctx) => {
  ctx.session.order.status = 'PG'
  await saveOrder(ctx);
})

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});

bot.start({ drop_pending_updates: true });

