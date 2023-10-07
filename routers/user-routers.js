const express = require("express");
const jsonParser = express.json();

const userRouter = express.Router();

const { getUser, getUserId, getUserDelete, getUserPost, getUserPut } = require('../controller/user-controller');

userRouter.post("/create", jsonParser, getUserPost);
userRouter.get("/allusers/", getUser);
userRouter.get("/id/:id", getUserId);
userRouter.delete("/delete/:id", getUserDelete);
userRouter.put("/update", jsonParser, getUserPut);

module.exports = userRouter;

