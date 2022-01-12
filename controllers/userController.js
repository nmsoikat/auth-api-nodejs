const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("../models/UserModal");
const generateToken = require("../utils/generateToken");

//@desc   Register new user // bcrypt password
//@route  POST /api/v1/users/register
//@access Public
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // user exist
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      const user = await UserModel.create({ username, email, password });

      if (user) {
        res.json({ _id: user._id, username: user.username, email: user.email });
      } else {
        throw new Error("User not created");
      }
    } else {
      throw new Error("User already exist!");
    }
  } catch (err) {
    next(err)
  }
};

//@desc   Login user, match password, and get token
//@route  POST /api/v1/users/login
//@access Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExist = await UserModel.findOne({ email }).select("+password");

    if (userExist && (await userExist.matchPassword(password))) {
      res.json({
        _id: userExist._id,
        username: userExist.username,
        email: userExist.email,
        token: generateToken(userExist._id),
      });
    } else {
      throw new Error("Email or password dose not match")
    }
  } catch (err) {
    next(err)
  }
};
