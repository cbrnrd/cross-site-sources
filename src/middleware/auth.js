const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userId;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;