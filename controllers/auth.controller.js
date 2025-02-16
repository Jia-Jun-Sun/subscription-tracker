import mongoose from 'mongoose';
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

export const signUp = async (req, res, next) => {
    // Implement sign up logic here
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // this part of the code focuses on creating a new user

        const { name, email, password } = req.body;

        // checks if an user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) { // if user already exist
            const error = new Error('User already exists');
            error.statusCode = 409;
        }

        // Hashing a password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // actually creating a new user
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    // Implement sign in logic here
    try {
        // checking/comparing email logic
        const { email, password } = req.body; // we want to extract the username and password the client sent us when logging in

        const user = await User.findOne({ email }); // This is a Mongoose query. It searches the MongoDB database in the User collection for a document (record) where the email field matches the provided email.

        if (!user) { // if the user doesn't exist
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }


        // checking/comparing password logic
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) { // if password is not valid
            const error = new Error('Password is not valid');
            error.statusCode = 401;
            throw error;
        }

        // but if password is valid, we're going to generate a token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // once the email and password is successful
        res.status(200).json({
            success: true,
            message: "User signed in Successfully, hoorayyyy",
            data: {
                token,
                user,
            }
        });
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    // Implement sign out logic here
}