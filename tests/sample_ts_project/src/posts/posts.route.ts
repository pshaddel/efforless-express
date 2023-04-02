const express = require("express");
const userRouter = express.Router();

userRouter.use((_req, res, next) => {
  res.json({ message: "Posts Base router: posts.js" });
});

module.exports = userRouter;
