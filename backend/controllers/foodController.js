const db = require('../config/db');


// GET ALL FOODS

exports.getFoods = (req, res) => {

    const sql = 'SELECT * FROM food_items';

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                error: err.message
            });
        }

        return res.json(result);
    });
};



// ADD FOOD

exports.addFood = (req, res) => {

    const {

        name,

        price,

        description,

        image

    } = req.body;

    const sql =

        'INSERT INTO food_items (name, price, description, image) VALUES (?, ?, ?, ?)';

    db.query(

        sql,

        [name, price, description || '', image],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });
            }

            return res.json({

                message: 'Food Added Successfully'
            });
        }
    );
};



// DELETE FOOD

exports.deleteFood = (req, res) => {

    const id = req.params.id;

    const sql =

        'DELETE FROM food_items WHERE id = ?';

    db.query(

        sql,

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });
            }

            return res.json({

                message: 'Food Deleted Successfully'
            });
        }
    );
};



// UPDATE FOOD

exports.updateFood = (req, res) => {

    const id = req.params.id;

    const {

        name,

        price,

        description,

        image

    } = req.body;

    const sql =

        'UPDATE food_items SET name=?, price=?, description=?, image=? WHERE id=?';

    db.query(

        sql,

        [name, price, description || '', image, id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });
            }

            return res.json({

                message: 'Food Updated Successfully'
            });
        }
    );
};