import jwt from 'jsonwebtoken';

import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";


// this middleware is essentially finding out WHO is making the request to for example get user details by checking their login token


const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) { // if the token doesn't exist
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // otherwise
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};


export default authorize;