const db = require('../config/db');


// GET ALL FOODS

exports.getFoods = (req, res) => {

    const sql = 'SELECT * FROM foods';

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

        image

    } = req.body;

    const sql =

        'INSERT INTO foods (name, price, image) VALUES (?, ?, ?)';

    db.query(

        sql,

        [name, price, image],

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

        'DELETE FROM foods WHERE id = ?';

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

        image

    } = req.body;

    const sql =

        'UPDATE foods SET name=?, price=?, image=? WHERE id=?';

    db.query(

        sql,

        [name, price, image, id],

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