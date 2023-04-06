import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
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
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        var isAdmin = false;
        User.findById(decoded.userId).then(user => {
            isAdmin = user.role === 'admin';
            if (!isAdmin) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            req.userId = decoded.userId;
            next();
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};


export { auth, adminAuth };
