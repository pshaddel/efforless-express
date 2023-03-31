// export default function middleware(req, res, next) {
//     res.json({ message: "Hello World!" })
// }
const express = require('express');
const userRouter = express.Router();

userRouter.use((req, res, next) => {
    res.json({ message: "User Router" })
})

module.exports = userRouter;