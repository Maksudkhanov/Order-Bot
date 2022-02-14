const {
  Bot,
  session,
} = require("grammy");
const { I18n } = require("@grammyjs/i18n");
const token = require("./token");
const {
  start,
  dish,
  back,
  number,
  paymentType,
  userPhoneNumber,
  location,
  main,
  backWithClean,
} = require("./keyboards/ui");
const { greetUser } = require("./actions/greetUser");
const { getWord } = require("./utils/getWord");
const { showOrder } = require("./actions/showOrder");
const { proccessOrder } = require("./actions/proccessOrder");
const { defineLanguage } = require("./actions/defineLanguage");
const { showSettings } = require("./actions/showSettings");
const { OnPhoneNumber } = require("./handlers/OnPhoneNumber");
const { OnLocation } = require("./handlers/OnLocation");
const User = require("./models/User");
const saveOrder = require("./actions/saveOrder");
const Order = require("./models/Order");
const moment = require('moment');
const updateUser = require('./db/queries/updateUser');

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

require("./db/connection");

// bot.command("pay", async (ctx) => {
//   // console.log('+++++++++++++++++++++++++');
//   // console.log(back(ctx).inline_keyboard[0][0]);
//   return await ctx.replyWithInvoice(
//     'Payment', ctx.i18n.t("pay"), 'payload', 
//     '371317599:TEST:1644420941421',
//      'UZS', [
//       { label: '10', amount: `100000` }
//      ]
//   // , {reply_markup: back(ctx)}
//   )
// })


bot.command("start", async (ctx) => {
  ctx.session.flag = "";

  if (!ctx.session.user.language) {
    return ctx.reply("Tilni tanlang\nВыберите язык", { reply_markup: start });
  }

  return greetUser(ctx);
});

function isStart(word) {
  return !word.includes(".re.");
}

bot.callbackQuery(/lang./, async (ctx) => {
  ctx.answerCallbackQuery();
  ctx.session.user.language = defineLanguage(ctx)
  ctx.i18n.locale(ctx.session.user.language)

  await setUserLanguage(ctx.session.telegramId, ctx.session.user.language)

  if (isStart(ctx.match.input)) {
    await ctx.deleteMessage();
    return greetUser(ctx);
  }

  return showSettings(ctx);
});

bot.callbackQuery(/order/,async (ctx) => {
  await ctx.deleteMessage();
  return showOrder(ctx);
});

bot.callbackQuery(/backto./, async (ctx) => {
  ctx.answerCallbackQuery();

  const word = getWord(ctx);
  if (word === "main") {
    ctx.editMessageText(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
      .catch(() => {
        ctx.deleteMessage();
        ctx.reply(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
      })
  }

  if (word === 'withClean') {
    ctx.editMessageText(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
    ctx.session.order = {}
  }

  if (word === 'withPayment') {
    ctx.deleteMessage();
    ctx.deleteMessage();
    ctx.reply(ctx.i18n.t("hey"), { reply_markup: main(ctx) })
  }
});

bot.callbackQuery(/menu./, async (ctx) => {
  ctx.answerCallbackQuery();

  ctx.editMessageText(
    ctx.i18n.t("yourOrder") + "\n" + ctx.i18n.t("amount") + ": " +
    ctx.session.order.amount +
    "\n" + ctx.i18n.t("sum") + ': ' + ctx.session.order.sum + ' ' + ctx.i18n.t("currency"),
    {
      reply_markup: dish(ctx),
    }
  );
});

bot.callbackQuery(/historyOfOrders/, async (ctx) => {
  ctx.answerCallbackQuery();
  const page = getWord(ctx);

  const orders = await Order.find({
    user_id: ctx.session.user.telegramId,
  }).lean();

  if (orders.length === 0) {
    return ctx.editMessageText(ctx.i18n.t("noOrders"), { reply_markup: back(ctx) })
  }

  let { message, keyboard } = orderPage(ctx, orders, page)
  if (orders.length > 0 && orders.length < 3) {
    keyboard = back(ctx)
  }

  ctx.editMessageText(message, { reply_markup: keyboard })

});

bot.callbackQuery(/count./, async (ctx) => {
  ctx.answerCallbackQuery();

  const word = getWord(ctx);
  proccessOrder(ctx, word);
});

bot.callbackQuery(/settings/, (ctx) => {
  ctx.answerCallbackQuery();

  showSettings(ctx);
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
    ctx.deleteMessage()

    return ctx.reply(
      ctx.i18n.t("isYourPhoneNumber") + " : " + ctx.session.user.phoneNumber,
      { reply_markup: userPhoneNumber(ctx) }
    );
  }

  ctx.session.flag = "phone";
  return ctx.reply(ctx.i18n.t("askForNumber"), { reply_markup: number(ctx) });
});

bot.callbackQuery(/phoneNumber/, async (ctx) => {
  ctx.answerCallbackQuery();
  const answer = getWord(ctx);


  switch (answer) {
    case "yes":
      ctx.deleteMessage();
      ctx.session.flag = "location"
      ctx.session.order.phoneNumber = ctx.session.user.phoneNumber
      return ctx.reply(ctx.i18n.t("askForLocation"), {
        reply_markup: location(ctx),
      });

    case "no":
      ctx.session.flag = "phone";
      ctx.deleteMessage();
      return ctx.reply(ctx.i18n.t("askForNumber"), {
        reply_markup: number(ctx),
      });

    default:
      break;
  }
});

bot.on(":contact", async (ctx) => {
  return await OnPhoneNumber(ctx);
});

bot.on("::phone_number", async (ctx) => {
  return await OnPhoneNumber(ctx);
});

bot.on(":location", async (ctx) => {
  return OnLocation(ctx);
});

bot.on("message:text", (ctx) => {
  switch (ctx.session.flag) {
    case "name":
      ctx.session.order.username = ctx.message.text;


      return ctx.reply(
        ctx.i18n.t("yourOrder") + "\n" + ctx.i18n.t("amount") + ": " +
        ctx.session.order.amount +
        "\n" + ctx.i18n.t("sum") + ': ' + ctx.session.order.sum + ' ' + ctx.i18n.t("currency") +

        "\n\n" + ctx.i18n.t("chooseTypeOfPayment"),
        { reply_markup: paymentType(ctx) }
      );

    default:
      break;
  }
});

bot.callbackQuery(/payment/, async (ctx) => {
  ctx.answerCallbackQuery();
  const typeOfPayment = getWord(ctx);
  ctx.session.order.typeOfPayment = typeOfPayment;
  ctx.session.order.user_id = ctx.session.user.telegramId;


  if (ctx.session.order.typeOfPayment === 'cash') {
    ctx.session.order.status = 'NP'
    await saveOrder(ctx);
    return ctx.editMessageText(ctx.i18n.t("yourOrder") + "\n" + ctx.i18n.t("amount") + ": " +
      ctx.session.order.amount +
      "\n" + ctx.i18n.t("sum") + ': ' + ctx.session.order.sum + ' ' + ctx.i18n.t("currency") +

      "\n\n" + ctx.i18n.t("typeOfPayment") + ": " + ctx.i18n.t(`${ctx.session.order.typeOfPayment}`) +
      '\n' + ctx.i18n.t("status") + ": " + ctx.i18n.t(`${ctx.session.order.status}`),
      { reply_markup: backWithClean(ctx) })
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
});

bot.on(":successful_payment", async (ctx) => {
  ctx.session.order.status = 'PG'
  await saveOrder(ctx);
})

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});

bot.start({ drop_pending_updates: true });


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
