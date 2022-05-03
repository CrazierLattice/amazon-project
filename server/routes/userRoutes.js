import bcryptjs from 'bcryptjs';
import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth } from '../utils.js';
import { Router } from 'express';

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

userRouter.put(
  '/updateprofile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword)
        return res.status(403).json({ message: 'Password must match!' });

      const hashedPassword = bcryptjs.hashSync(password, 8);
      const user = await User.findById({ _id: req.user._id });
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = hashedPassword;
      const newUser = await user.save();

      res.send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser),
      });
    } catch (error) {
      res.status(403).send({ message: 'User not found' });
    }
  })
);

export default userRouter;
