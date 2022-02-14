const { InlineKeyboard, Keyboard} = require("grammy")

const start = new InlineKeyboard()
    .text("🇺🇿 O'zbek", "lang.uz")
    .row()
    .text("🇷🇺 Русский", "lang.ru");

const main = (ctx) => {
    return new InlineKeyboard()
    .text(ctx.i18n.t("order"), "order").row()
    // .text(ctx.i18n.t("location"), "location").row()
    .text(ctx.i18n.t("historyOfOrders"), "historyOfOrders").row()
    .text(ctx.i18n.t("settings"), "settings")
    // .text(ctx.i18n.t("personalData"), "personal.Data")
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

// const backwithPayment = (ctx) => {
//   return new InlineKeyboard()
//   .text(ctx.i18n.t("back"), "backto.withPayment")
// }


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

const number = (ctx) => {
  return new Keyboard()
  .requestContact(ctx.i18n.t('sendContact'))
}

const location = (ctx) => {
  return new Keyboard()
  .requestLocation(ctx.i18n.t("sendLocation"))
}

const paymentType = (ctx) => {
  return  new InlineKeyboard()
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
console.log(new InlineKeyboard()
.text('ctx.i18n.t("yes")', "phoneNumber.yes").row()
.text('ctx.i18n.t("yes")', "phoneNumber.yes").row().inline_keyboard);

const list = (ctx, list, page = 0) => {
  console.log(page);
  page = parseInt(page)
  const limit = 3
  const btns = []
  
  for (let i =0; i < limit; i++) {
    btns.push([{ text: list[page][i]+ 'ctx.i18n.t("yes")', callback_data: 'phoneNumber.yes' }])
  }
  // for (let i = page * limit; i < (page + 1) * limit; i++) {
  //   btns.push([{ text: list[i]+ 'ctx.i18n.t("yes")', callback_data: 'phoneNumber.yes' }])
  // }
  for (let i = 0; i < limit; i++) {
    btns.push([{ text: list[page*limit+i].createdAt, callback_data: 'phoneNumber.yes' }])
  }
  for (const ls of list) {
  }
const next = (page + 1) % (Math.floor(list.length / limit))
const prew = (page - 1) % (Math.floor(list.length / limit))

btns.push([
  { text: ctx.i18n.t("back"), callback_data: `historyOfOrders.${prew}` },
  { text: ctx.i18n.t("next"), callback_data: `historyOfOrders.${next}` }
])

btns.push([
  { text: ctx.i18n.t("back"), callback_data: `main` }
])
  return {inline_keyboard: btns}
}
module.exports = {
  start,
  main,
  dish, 
  back,
  basket,
  settings,
  number,
  paymentType, 
  location,
  userPhoneNumber,
  list,
  backWithClean
};
