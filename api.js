const moment = require('moment');

async function exectuedOrder(executedOrderList, tickerTape, currentOrder) {

    try {

        let tick = currentOrder.tick;
        let type = currentOrder.type;

        if (type == 'buy') {

            // get the latest order for the opposite side i.e Sell side
            let totalOrders = tickerTape[`${tick}`]['sell'].length;
            let oppositeOrder = tickerTape[`${tick}`]['sell'][totalOrders - 1];

            if (oppositeOrder && currentOrder.price >= oppositeOrder.price) {

                let remaningQuantity = currentOrder.quantity - oppositeOrder.quantity;

                // full execution
                if (remaningQuantity <= 0) {

                    oppositeOrder.quantity = Math.abs(remaningQuantity);
                    if (remaningQuantity == 0) {
                        tickerTape[`${tick}`]['sell'].pop();
                        executedOrderList.push({
                            'timestamp': moment().format(),
                            'ticker': tick,
                            'quantity': currentOrder.quantity,
                            'price': currentOrder.price
                        });
                    }
                    else {
                        tickerTape[`${tick}`]['sell'].pop();
                        executedOrderList.push({
                            'timestamp': moment().format(),
                            'ticker': tick,
                            'quantity': currentOrder.quantity,
                            'price': currentOrder.price
                        });
                        tickerTape[`${tick}`]['sell'].push(oppositeOrder);
                    }
                }
                // partial execution
                else if (remaningQuantity > 0) {

                    currentOrder.quantity = Math.abs(remaningQuantity);
                    tickerTape[`${tick}`]['sell'].pop();
                    executedOrderList.push({
                        'timestamp': moment().format(),
                        'ticker': tick,
                        'quantity': oppositeOrder.quantity,
                        'price': currentOrder.price
                    });
                    // call the same fuction again if quantiy still left
                    await exectuedOrder(executedOrderList, tickerTape, currentOrder);

                }

            }
            else if (!oppositeOrder || !(currentOrder.price >= oppositeOrder.price)) {
                tickerTape[`${tick}`]['buy'].push(currentOrder);
            }

        }
        else if (type == 'sell') {

            // get the latest order for the opposite side i.e Buy side
            let totalOrders = tickerTape[`${tick}`]['buy'].length;
            let oppositeOrder = tickerTape[`${tick}`]['buy'][totalOrders - 1];

            if (oppositeOrder && currentOrder.price <= oppositeOrder.price) {

                let remaningQuantity = currentOrder.quantity - oppositeOrder.quantity;

                // full execution
                if (remaningQuantity <= 0) {

                    oppositeOrder.quantity = Math.abs(remaningQuantity);
                    if (remaningQuantity == 0) {
                        tickerTape[`${tick}`]['buy'].pop();
                        executedOrderList.push({
                            'timestamp': moment().format(),
                            'ticker': tick,
                            'quantity': currentOrder.quantity,
                            'price': oppositeOrder.price
                        });
                    }
                    else {
                        tickerTape[`${tick}`]['buy'].pop();
                        executedOrderList.push({
                            'timestamp': moment().format(),
                            'ticker': tick,
                            'quantity': currentOrder.quantity,
                            'price': oppositeOrder.price
                        });
                        tickerTape[`${tick}`]['buy'].push(oppositeOrder);
                    }
                }
                // partial execution
                else if (remaningQuantity > 0) {

                    currentOrder.quantity = Math.abs(remaningQuantity);
                    tickerTape[`${tick}`]['buy'].pop();
                    executedOrderList.push({
                        'timestamp': moment().format(),
                        'ticker': tick,
                        'quantity': oppositeOrder.quantity,
                        'price': oppositeOrder.price
                    });
                    // call the same fuction again if quantiy still left
                    await exectuedOrder(executedOrderList, tickerTape, currentOrder);

                }

            }
            else if (!oppositeOrder || !(currentOrder.price <= oppositeOrder.price)) {
                tickerTape[`${tick}`]['sell'].push(currentOrder);
            }
        }

    } catch (err) {
        console.error('Error in exectuedOrder Api:', err);
        throw new Error(err);
    }

}

module.exports = { exectuedOrder };