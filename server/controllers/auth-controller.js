const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userLogic = require("../business-logic/auth-logic");
const authMiddleware = require("../middleware/auth-middleware");
const User = require("../model/user-model");
const { OAuth2Client } = require("google-auth-library");

//register user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    let user = new User(
      undefined,
      firstName,
      lastName,
      username,
      password,
      undefined
    );

    const errors = user.validatePost();
    if (errors) {
      // res.status(400).json(errors);
      // return;
      return res.status(400).json({ errors: [{ msg: errors }] });
    }

    const isUsernameExists = await userLogic.getUser(username);
    if (isUsernameExists) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Username already taken" }] });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const didCreateUser =  await userLogic.registerUser(user);
    if (!didCreateUser) {
      return res
      .status(400)
      .json({ errors: [{ msg: "failed to Register User" }] });
    }

    const payload = {
      user: {
        userId: user.userId,
        isAdmin: user.isAdmin,
      },
    };
    jwt.sign(payload, config.jwtSecret, { expiresIn: "5d" }, (err, token) => {
      if (err) {
        throw new Error(err);
      }
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      // return res.status(400).json({ errors: "Username Required" });
      return res.status(400).json({ errors: [{ msg: "Username Required" }] });
    }
    if (!password) {
      return res.status(400).json({ errors: [{ msg: "Password required" }] });
    }

    const user = await userLogic.getUser(username);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
    }

    const payload = {
      user: {
        userId: user.userId,
        isAdmin: user.isAdmin,
      },
    };
    jwt.sign(payload, config.jwtSecret, { expiresIn: "5d" }, (err, token) => {
      if (err) {
        throw new Error(err);
      }
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// get auth user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await userLogic.getAuthUser(req.user.userId);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User Wasn't Found" }] });
    }
    user.password = undefined;
    res.json(user);
  } catch (error) {
    res.status(500).send("server error");
  }
});


// const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
// router.post("/google-login",(req,res) => {
//   const { idToken } = req.body;

//   client
//     .verifyIdToken({ idToken, audience: config.GOOGLE_CLIENT_ID })
//     .then((response) => {
//       // console.log('GOOGLE LOGIN RESPONSE',response)
//       const { email_verified, name, email } = response.payload;
//       if (email_verified) {
//         User.findOne({ email }).exec((err, user) => {
//           if (user) {
//             const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
//               expiresIn: "7d",
//             });
//             const { _id, email, name, role } = user;
//             return res.json({
//               token,
//               user: { _id, email, name, role },
//             });
//           } else {
//             let password = email + config.JWT_SECRET;
//             user = new User({ name, email, password });
//             user.save((err, data) => {
//               if (err) {
//                 console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
//                 return res.status(400).json({
//                   error: "User signup failed with google",
//                 });
//               }
//               const token = jwt.sign(
//                 { _id: data._id },
//                 config.jwtSecret,
//                 { expiresIn: "7d" }
//               );
//               const { _id, email, name, role } = data;
//               return res.json({
//                 token,
//                 user: { _id, email, name, role },
//               });
//             });
//           }
//         });
//       } else {
//         return res.status(400).json({
//           error: "Google login failed. Try again",
//         });
//       }
//     });
// });
module.exports = router;
