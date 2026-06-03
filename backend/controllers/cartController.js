const db = require('../config/db');

// GET USER'S CART
exports.getCart = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT c.id, c.food_id, c.quantity, f.name, f.price, f.description, f.image
        FROM cart c
        JOIN food_items f ON c.food_id = f.id
        WHERE c.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(results);
    });
};

// ADD ITEM TO CART OR INCREMENT QUANTITY
exports.addToCart = (req, res) => {
    const user_id = req.user.id;
    const { food_id, quantity } = req.body;

    const qty = quantity || 1;

    // Use ON DUPLICATE KEY UPDATE to increment quantity if the item is already in the cart
    const sql = `
        INSERT INTO cart (user_id, food_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;

    db.query(sql, [user_id, food_id, qty, qty], (err, result) => {
        if (err) {
            console.error('Error adding to cart:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ message: 'Item added to cart successfully' });
    });
};

// UPDATE CART ITEM QUANTITY (SET EXACT VALUE)
exports.updateCartItem = (req, res) => {
    const user_id = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (quantity <= 0) {
        // If quantity is 0 or less, delete the item instead
        return exports.deleteCartItem(req, res);
    }

    const sql = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';

    db.query(sql, [quantity, cartItemId, user_id], (err, result) => {
        if (err) {
            console.error('Error updating cart:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ message: 'Cart updated successfully' });
    });
};

// REMOVE ITEM FROM CART
exports.deleteCartItem = (req, res) => {
    const user_id = req.user.id;
    const cartItemId = req.params.id;

    const sql = 'DELETE FROM cart WHERE id = ? AND user_id = ?';

    db.query(sql, [cartItemId, user_id], (err, result) => {
        if (err) {
            console.error('Error removing from cart:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ message: 'Item removed from cart' });
    });
};

// CLEAR CART
exports.clearCart = (req, res) => {
    const user_id = req.user.id;

    const sql = 'DELETE FROM cart WHERE user_id = ?';

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Error clearing cart:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ message: 'Cart cleared successfully' });
    });
};
