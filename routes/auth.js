var express = require("express");
const passport = require("passport");
var router = express.Router();
var User = require("../models/user");
const bcrypt = require("bcrypt");
var issueJWT = require("../utils/issueJWT");
const mongoose = require('mongoose');


/* GET home page. */
router.post("/register", function (req, res, next) {
  User.find({ username: req.body.username })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(409).json({
          message: "username exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
              console.log(err)
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              friends: [],
              blocked: [],
              requests: [],
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/login", function (req, res, next) {
  User.find({ username: req.body.username })
    .exec()
    .then((result) => {
      console.log("result =========>",result);
      if (result[0]) {
        bcrypt.compare(
          req.body.password,
          result[0].password,
          function (err, compRes) {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              if (compRes) {
                res.json({
                  ...issueJWT(result[0]),
                  username: req.body.username,
                });
              } else {
                res.status(409).json({ message: "wrong username or password" });
              }
            }
          }
        );
      } else {
        res.status(409).json({ err: "wrong username or password" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({ auth: true });
  }
);

module.exports = router;
