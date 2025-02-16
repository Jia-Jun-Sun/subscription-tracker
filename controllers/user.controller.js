import User from "../models/user.model.js";

// function that fetches all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({ success: true, data: users })
    } catch (error) {
        next(error); // forwarding the error onto the error handler or the next handler
    }
}


// function that fetches individual users
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // once found a user, select all the fields of that user except for the password

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error); // forwarding the error onto the error handler or the next handler
    }
}