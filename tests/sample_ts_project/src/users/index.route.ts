const express = require("express");
const userRouter = express.Router();

userRouter.use((_req, res, next) => {
  res.json({ message: "users router: index.route.js" });
});

module.exports = userRouter;
