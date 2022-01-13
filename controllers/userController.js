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

    // const { username, email, password, role } = req.body;
    // warning: now someone can put role using api request like {"role": "admin"}
    // I have use here only for testing.

    // user exist
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      const user = await UserModel.create({ username, email, password});

      if (user) {
        res.json({ _id: user._id, username: user.username, email: user.email });
      } else {
        throw new Error("User not created");
      }
    } else {
      throw new Error("User already exist!");
    }
  } catch (err) {
    next(err);
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
        role: userExist.role,
        token: generateToken(userExist._id),
      });
    } else {
      throw new Error("Email or password dose not match");
    }
  } catch (err) {
    next(err);
  }
};

//@desc   Read All User
//@route  GET /api/va1/users
//@access Private
exports.readAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({});

    if (users.length > 0) {
      res.json(users);
    } else {
      res.status(404);
      throw new Error("Users not found");
    }
  } catch (err) {
    next(err);
  }
};

//@desc   Delete By Id
//@route  DELETE /api/va1/users/:id
//@access Private and only for admin
exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete(id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    next(err);
  }
};
