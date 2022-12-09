const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
require("dotenv").config();
const Jimp = require("jimp");
const { v4: uuid } = require("uuid");
const { addUser, getUserByEmail, updateUser } = require("../models");

const { PORT } = process.env;

const userRegistration = async (req, res, next) => {
  const { password, email } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  req.body.password = hashedPassword;
  req.body.avatarURL = gravatar.url(email);
  try {
    const user = await addUser(req.body);
    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    error.status = 409;
    error.message = "Email in use";
    throw error;
  }
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const userFromDB = await getUserByEmail(email);
  if (!userFromDB) {
    const error = new Error("Email or password is wrong");
    error.status = 401;
    throw error;
  }
  const isComparedPasswordTheSame = await bcrypt.compare(
    password,
    userFromDB.password
  );
  if (!isComparedPasswordTheSame) {
    const error = new Error("Email or password is wrong");
    error.status = 401;
    throw error;
  }
  const token = jwt.sign({ _id: userFromDB._id }, process.env.JWT_SECRET);
  await updateUser(userFromDB._id, { token });

  res.status(200).json({
    token,
    user: { email: userFromDB.email, subscription: userFromDB.subscription },
  });
};

const userLogout = async (req, res, next) => {
  let { _id, token } = req.user;
  token = null;
  const user = await updateUser(_id, { token });
  console.log(user);
  res.status(204).json();
};

const userCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const modifyUserAvatar = async (req, res, next) => {
  const avatarFile = await Jimp.read(req.file.path);
  const fileName = uuid() + "." + avatarFile.getExtension();
  const newPath = path.join("public/avatars", fileName);
  avatarFile.resize(250, 250).write(newPath);
  await fs.unlink("tmp/" + req.file.filename);
  const avatarURL = `http://localhost:${PORT}/avatars/${fileName}`;
  const userFromBD = await updateUser(req.user._id, { avatarURL });
  res.status(200).json({ avatarURL: userFromBD.avatarURL });
};

module.exports = {
  userRegistration,
  userLogin,
  userLogout,
  userCurrent,
  modifyUserAvatar,
};

