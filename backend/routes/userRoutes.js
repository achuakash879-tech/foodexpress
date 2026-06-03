const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser
} = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', verifyToken, (req, res) => {

    res.json({

        message: 'Protected Profile Access',

        user: req.user
    });
});

module.exports = router;