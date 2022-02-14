const Order = require('../../models/Order');

async function getUserOrders(telegramId) {

    const orders = await Order.find({
        user_id: telegramId,
    })
    .lean()
    .catch((error) => {
        console.error(error.message);
    });
    return orders


}

module.exports = {
    getUserOrders
}

