import { Router } from 'express';
import { getUsers, getUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers); // get all users
userRouter.get('/:id', authorize, getUser); // get user details

userRouter.post('/', (req, res) => res.send({ title: 'Create new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'Update user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'Delete a user' }));


export default userRouter;