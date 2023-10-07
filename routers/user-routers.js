const express = require("express");
const jsonParser = express.json();

const userRouter = express.Router();

const { getUser, getUserId, getUserDelete, getUserPost, getUserPut } = require('../controller/user-controller');

userRouter.post("/api/create", jsonParser, getUserPost);
userRouter.get("/api/allusers/", getUser);
userRouter.get("/api/id/:id", getUserId);
userRouter.delete("/api/delete/:id", getUserDelete);
userRouter.put("/api/update", jsonParser, getUserPut);

module.exports = userRouter;

