const User = require('../models/User')

async function saveUser(ctx) {
    try {
        await User.create({
            telegramId: ctx.from.id
        })
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = saveUser