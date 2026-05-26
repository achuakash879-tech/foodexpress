const db = require('../config/db');



// PLACE ORDER

exports.placeOrder = (req, res) => {

    const user_id = req.user.id;

    const {

        food_name,

        price,

        quantity

    } = req.body;

    const sql =

        `INSERT INTO orders
        (user_id, food_name, price, quantity)

        VALUES (?, ?, ?, ?)`;

    db.query(

        sql,

        [user_id, food_name, price, quantity],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    error: err.message
                });
            }

            return res.json({

                message:
                'Order Placed Successfully'
            });
        }
    );
};



// GET MY ORDERS

exports.getMyOrders = (req, res) => {

    const user_id = req.user.id;

    const sql =

        'SELECT * FROM orders WHERE user_id = ?';

    db.query(

        sql,

        [user_id],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    error: err.message
                });
            }

            return res.json(result);
        }
    );
};



// GET ALL ORDERS (ADMIN)

exports.getAllOrders = (req, res) => {

    const sql = 'SELECT * FROM orders';

    db.query(

        sql,

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    error: err.message
                });
            }

            return res.json(result);
        }
    );
};



// UPDATE ORDER STATUS

exports.updateOrderStatus = (req, res) => {

    const id = req.params.id;

    const { status } = req.body;

    const sql =

        'UPDATE orders SET status=? WHERE id=?';

    db.query(

        sql,

        [status, id],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    error: err.message
                });
            }

            return res.json({

                message:
                'Order Status Updated'
            });
        }
    );
};