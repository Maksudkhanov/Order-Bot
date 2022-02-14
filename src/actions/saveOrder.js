const Order = require('../models/Order')

async function saveOrder(ctx) {

    try {
        const order = ctx.session.order
       await Order.create({
            user_id: order.user_id,
            username: order.username,
            phoneNumber: order.phoneNumber,
            amount: order.amount,
            sum: order.sum,
            status: order.status,
            typeOfPayment: order.typeOfPayment,
            location: order.location
        })
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = saveOrder