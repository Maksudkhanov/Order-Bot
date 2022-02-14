const { Keyboard } = require('grammy')

const number = (ctx) => {
    return new Keyboard()
        .requestContact(ctx.i18n.t('sendContact'))
        
}

const location = (ctx) => {
    return new Keyboard()
        .requestLocation(ctx.i18n.t("sendLocation"))
        
}


module.exports = {
    number,
    location
}

