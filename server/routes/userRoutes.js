import bcryptjs from 'bcryptjs';
import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const checkPasswordValidation = bcryptjs.compareSync(
        password,
        user.password
      );
      if (checkPasswordValidation) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password ' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      console.log(existingUser);
      if (existingUser)
        return res.status(403).json({ message: 'Email is already taken.' });
      const newUser = new User({
        name,
        email,
        password: bcryptjs.hashSync(password),
      });
      await newUser.save();
      res.send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser),
      });
    } catch (error) {
      console.log(error);
      res.status(403).send({ error });
    }
  })
);

export default userRouter;
