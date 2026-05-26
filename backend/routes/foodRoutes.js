const express = require('express');

const router = express.Router();

const foodController =
require('../controllers/foodController');


// GET ALL FOODS

router.get(

    '/all',

    foodController.getFoods
);


// ADD FOOD

router.post(

    '/add',

    foodController.addFood
);


// DELETE FOOD

router.delete(

    '/delete/:id',

    foodController.deleteFood
);


// UPDATE FOOD

router.put(

    '/update/:id',

    foodController.updateFood
);


module.exports = router;