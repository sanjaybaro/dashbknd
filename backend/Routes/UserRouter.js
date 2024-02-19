const express = require("express");
const { UserModel } = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const { auth } = require("../MiddleWare/auth");

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: "./userProfile",
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handling User Sign Up
userRouter.post("/signUp", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(200).send({ message: "Email Already Exist" });
    } else {
      // Hashing User Password
      bcrypt.hash(password, 5, async (err, hash) => {
        // Store hash in your password DB.
        if (err) {
          res.status(200).send({ message: "Something went wrong Try Again" });
        }

        // Adding credential to database
        const newUser = UserModel({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send({ message: "Signup Success" });
      });
    }
  } catch (error) {
    res.status(400).send({ message: "Something went wrong Cannot Sign Up" });
  }
});

// Handling User Login
userRouter.post("/login", async (req, res) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;
    console.log(req.body);
    const existingUser = await UserModel.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      // Comparing the user pssword and existing user password
      bcrypt.compare(password, existingUser.password, function (err, result) {
        // result == true
        if (err) {
          res.status(200).send({ message: "Wrong Password" });
        }

        const token = jwt.sign(
          { userId: existingUser._id, userEmail: existingUser.email },
          process.env.SECRET_KEY
        );
        res
          .status(200)
          .send({
            message: "Login Success",
            token: token,
            userId: existingUser._id,
          });
      });
    } else {
      res.status(200).send({ message: "Email does not Exists" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something went wrong. Try Again." });
  }
});

userRouter.get("/singleUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await UserModel.findOne({ _id: id });
      res.status(200).send({ user: user });
    } else {
      res.status(200).send({ message: "Cannot find user" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something went wrong. Try Again." });
  }
});

// userProfileUpdate

userRouter.patch(
  "/userProfileUpdate",
  upload.single("userImage"),
  auth,
  async (req, res) => {
    const file = req.file;

    try {
      const { email, password, firstName, lastName, state, city } = req.body;

      console.log(email, password, firstName, lastName, state, city, user);

      const updateFields = {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(state !== undefined && { state }),
        ...(city !== undefined && { city }),
      };

      if (file) {
        const destination = path.join(
          __dirname,
          "..",
          "userProfile",
          file.originalname
        );
        fs.renameSync(file.path, destination);

        const fileName = file.filename;
        const title = fileName.substring(0, fileName.lastIndexOf(".")); // Assuming the title is the part before the file extension
        const fileUrl = `${req.protocol}s://${req.get("host")}/userProfile/${
          file.filename
        }`;

        // Append the image URL to req.body.image
        req.body.image = fileUrl;

        // console.log(">>>>");
        // console.log(fileUrl);

        updateFields.image = fileUrl;
      }

      // console.log(...req.body);

      if (password) {
        bcrypt.hash(password, 5, async (err, hash) => {
          // Store hash in your password DB.
          if (err) {
            res.status(200).send({ msg: "Enter password again" });
          }

          updateFields.password = hash;

          console.log(updateFields);
          const ExistingUser = await UserModel.findByIdAndUpdate(
            { _id: user },
            { ...updateFields }
          );
          res.status(200).send({ msg: "Profile Updated" });
        });
      } else {
        const ExistingUser = await UserModel.findByIdAndUpdate(
          { _id: user },
          { ...updateFields }
        );
        res.status(200).send({ msg: "Profile Updated" });
      }
    } catch (error) {
      res.status(400).send({ msg: "Login Failed", err: error });
    }
  }
);

userRouter.get("/", async (req, res) => {
  try {
    const allUser = await UserModel.find();
    console.log(allUser);
    res.status(200).send({ allUser: allUser });
  } catch (error) {}
});

userRouter.get("/", async (req, res) => {
  try {
    const allUser = await UserModel.find();
    console.log(allUser);
    res.status(200).send({ allUser: allUser });
  } catch (error) {}
});

userRouter.delete("/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    if (_id) {
      await UserModel.findByIdAndDelete({ _id });
      res.status(200).send({ message: "Deleted" });
    }
    console.log(allUser);
    res.status(200).send({ allUser: allUser });
  } catch (error) {}
});

module.exports = {
  userRouter,
};
