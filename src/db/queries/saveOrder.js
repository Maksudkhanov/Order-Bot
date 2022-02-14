const Order = require('../../models/Order')

async function saveOrder(ctx) {


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
        .catch((error) => {
            console.error(error.message);
        })
        return
   
}

module.exports = saveOrder