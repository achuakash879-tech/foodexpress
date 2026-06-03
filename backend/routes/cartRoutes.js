const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken); // Secure all cart routes

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:id', cartController.updateCartItem);
router.delete('/delete/:id', cartController.deleteCartItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
