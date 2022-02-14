const User = require('../models/User')

async function saveUser(ctx) {

    await User.create({
        telegramId: ctx.from.id
    })
        .catch((error) => {
            console.error(error.message);
        })
        return

}

module.exports = saveUser