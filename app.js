const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jsonParser = express.json();
const jwt = require('jsonwebtoken');

const News = require('./model/user-model');
const { getUser, getUserId, getUserDelete, getUserPost, getUserPut} = require('./controller/user-controller');

async function main() {

    try {
        await mongoose.connect("mongodb://localhost:27017/newsline");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }
    catch (err) {
        return console.log(err);
    }
}

app.use((req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            tokenKey,
            (err, payload) => {
                if (err) next();
                else if (payload) {
                    for (let user of News) {
                        if (user.id === payload.id) {
                            req.user = user;
                            next();
                        }
                    }

                    if (!req.user) next();
                }
            }
        );
    }

    next();
});

app.get("/api/users", getUser);

app.get("/api/users/:id", getUserId);

app.post("/api/users", jsonParser, getUserPost);

app.delete("/api/users/:id", getUserDelete);

app.put("/api/users", jsonParser, getUserPut);

main();

process.on("SIGINT", async () => {

    await mongoose.disconnect();
    
    console.log("Приложение завершило работу");
    
    process.exit();
});