const express = require('express');

const router = express.Router();

const foodController =
require('../controllers/foodController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');


// GET ALL FOODS

router.get(

    '/all',

    foodController.getFoods
);


// ADD FOOD

router.post(

    '/add',

    verifyToken,

    verifyAdmin,

    foodController.addFood
);


// DELETE FOOD

router.delete(

    '/delete/:id',

    verifyToken,

    verifyAdmin,

    foodController.deleteFood
);


// UPDATE FOOD

router.put(

    '/update/:id',

    verifyToken,

    verifyAdmin,

    foodController.updateFood
);


module.exports = router;