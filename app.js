const mongoose = require("mongoose");
const express = require("express");
const jwt = require('jsonwebtoken');

const router = require('./routers/user-routers');
const News = require('./model/user-model');

const MONGO_DB = "mongodb://localhost:27017/newsline";
const PORT = 3000;

const app = express();
app.use(router);
app.use("/api", router);

async function main() {

    try {
        await mongoose.connect(MONGO_DB);//URL Базы данных
        app.listen(PORT);//Порт
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

main();
//Прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {

    await mongoose.disconnect();

    console.log("Приложение завершило работу");

    process.exit();
});