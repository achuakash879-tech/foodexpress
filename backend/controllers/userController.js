const db = require('../config/db');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


// REGISTER USER

exports.registerUser = async (req, res) => {

    const { name, email, password, role } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'customer';

        const sql = `
            INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(

            sql,

            [name, email, hashedPassword, userRole],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        error: err.message
                    });
                }

                return res.json({
                    message: 'User Registered Successfully'
                });
            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: error.message
        });
    }
};



// LOGIN USER

exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    console.log(email);

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        if (result.length === 0) {

            return res.status(404).json({
                message: 'User Not Found'
            });
        }

        const user = result[0];

        console.log(user);

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {

            return res.status(401).json({
                message: 'Invalid Password'
            });
        }

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '1h'
            }
        );

        return res.json({

            message: 'Login Successful',

            token,
            role: user.role
        });
    });
};