const express = require("express");
const jsonParser = express.json();

const userRouter = express.Router();

const { getUser, getUserEmail, getUserDelete, getUserPost, getUserPut } = require('../controller/user-controller');

userRouter.post("/create", jsonParser, getUserPost);
userRouter.get("/allusers/", getUser);
userRouter.get("/email/:id", getUserEmail);
userRouter.delete("/delete/:id", getUserDelete);
userRouter.put("/update", jsonParser, getUserPut);

module.exports = userRouter;

