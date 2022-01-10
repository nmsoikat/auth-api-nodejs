const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("../models/UserModal");
const generateToken = require("../utils/generateToken");

//@desc   Register new user // bcrypt password
//@route  POST /api/v1/users/register
//@access Public
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // user exist
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      console.log("user already exist");
      return;
    }

    const user = await UserModel.create({ username, email, password });

    if (user) {
      res.json({ _id: user._id, username: user.username, email: user.email });
    } else {
      console.log("User not created");
    }
  } catch (e) {
    console.log(e);
  }
};

//@desc   Login user, match password, and get token
//@route  POST /api/v1/users/login
//@access Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await UserModel.findOne({ email }).select('+password');

    if (userExist && (await userExist.matchPassword(password))) {
      res.json({
        _id: userExist._id,
        username: userExist.username,
        email: userExist.email,
        token: generateToken(userExist._id),
      });
    } else {
      console.log("Invalid username or password");
    }
  } catch (e) {
    console.log(e);
  }
};
