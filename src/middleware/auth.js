import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = (req, res, next) => {
    // TODO: change this to something a bit more standard for JWTs
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

const adminAuth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        User.findById(decoded.userId).then(user => {

            if (!user.isAdmin()) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

        });
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};


export { auth, adminAuth };
