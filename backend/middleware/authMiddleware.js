const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: 'Access Denied'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const verified = jwt.verify(

            token,

            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (error) {

        return res.status(400).json({
            message: 'Invalid Token'
        });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Access Denied: Admin role required'
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};