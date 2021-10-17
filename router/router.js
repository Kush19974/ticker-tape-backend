let router = require('express').Router();
let tickerTape = require('../data/ticker').ticker;
let orderExecuted = require('../data/ticker').orderExecuted;
let exectuedOrderApi = require('../apis/exectuedOrder').exectuedOrder;

router.route('/add-new-order')
    .post(function (req, res) {

        let order = req.body.order;
        let orderPlaced;

        (async () => {
            orderPlaced = await exectuedOrderApi(orderExecuted, tickerTape, order);
        })();

        if(orderPlaced){
            orderExecuted = orderPlaced.orderExecuted;
            tickerTape = orderPlaced.tickerTape;
        }

        res.send(tickerTape);
    })

router.route('/get-executed-orders')
    .get(function (req, res) {
        res.send(orderExecuted);
    })

module.exports = router;