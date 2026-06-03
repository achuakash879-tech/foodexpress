const db = require('../config/db');

// PLACE ORDER (CHECKOUT)
exports.placeOrder = (req, res) => {
    const user_id = req.user.id;

    // 1. Fetch user's cart items
    const getCartSql = `
        SELECT c.food_id, c.quantity, f.price 
        FROM cart c 
        JOIN food_items f ON c.food_id = f.id 
        WHERE c.user_id = ?
    `;

    db.query(getCartSql, [user_id], (err, cartItems) => {
        if (err) {
            console.error('Error fetching cart items for checkout:', err);
            return res.status(500).json({ error: err.message });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is Empty' });
        }

        // 2. Compute total price
        let total_price = 0;
        cartItems.forEach(item => {
            total_price += parseFloat(item.price) * item.quantity;
        });

        // 3. Create an entry in orders table
        const insertOrderSql = 'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)';

        db.query(insertOrderSql, [user_id, total_price, 'Pending'], (err, result) => {
            if (err) {
                console.error('Error creating order:', err);
                return res.status(500).json({ error: err.message });
            }

            const order_id = result.insertId;

            // 4. Create entries in order_items table
            const insertItemsSql = 'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES ?';
            const values = cartItems.map(item => [order_id, item.food_id, item.quantity, item.price]);

            db.query(insertItemsSql, [values], (err) => {
                if (err) {
                    console.error('Error creating order items:', err);
                    return res.status(500).json({ error: err.message });
                }

                // 5. Clear the user's cart
                const clearCartSql = 'DELETE FROM cart WHERE user_id = ?';

                db.query(clearCartSql, [user_id], (err) => {
                    if (err) {
                        console.error('Error clearing cart after checkout:', err);
                        // We still return success as order was placed, but log it
                    }

                    return res.json({
                        message: 'Order Placed Successfully',
                        order_id: order_id
                    });
                });
            });
        });
    });
};

// GET MY ORDERS
exports.getMyOrders = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT o.id AS order_id, o.total_price, o.status, o.created_at,
               oi.quantity, oi.price AS item_price, f.name AS food_name, f.image
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN food_items f ON oi.food_id = f.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching user orders:', err);
            return res.status(500).json({ error: err.message });
        }

        const ordersMap = {};
        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    id: row.order_id,
                    total_price: row.total_price,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }
            ordersMap[row.order_id].items.push({
                food_name: row.food_name,
                quantity: row.quantity,
                price: row.item_price,
                image: row.image
            });
        });

        return res.json(Object.values(ordersMap));
    });
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = (req, res) => {
    const sql = `
        SELECT o.id AS order_id, o.user_id, u.name AS customer_name, o.total_price, o.status, o.created_at,
               oi.quantity, oi.price AS item_price, f.name AS food_name, f.image
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN food_items f ON oi.food_id = f.id
        ORDER BY o.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching all orders for admin:', err);
            return res.status(500).json({ error: err.message });
        }

        const ordersMap = {};
        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    id: row.order_id,
                    user_id: row.user_id,
                    customer_name: row.customer_name,
                    total_price: row.total_price,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }
            ordersMap[row.order_id].items.push({
                food_name: row.food_name,
                quantity: row.quantity,
                price: row.item_price,
                image: row.image
            });
        });

        return res.json(Object.values(ordersMap));
    });
};

// UPDATE ORDER STATUS
exports.updateOrderStatus = (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const sql = 'UPDATE orders SET status = ? WHERE id = ?';

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: err.message });
        }

        return res.json({
            message: 'Order Status Updated'
        });
    });
};