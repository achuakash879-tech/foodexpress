const express = require('express');

const router = express.Router();

const orderController =
require('../controllers/orderController');

const authMiddleware =
require('../middleware/authMiddleware');



// PLACE ORDER

router.post(

    '/place',

    authMiddleware,

    orderController.placeOrder
);



// GET MY ORDERS

router.get(

    '/myorders',

    authMiddleware,

    orderController.getMyOrders
);



// GET ALL ORDERS

router.get(

    '/all',

    orderController.getAllOrders
);



// UPDATE ORDER STATUS

router.put(

    '/status/:id',

    orderController.updateOrderStatus
);


module.exports = router;