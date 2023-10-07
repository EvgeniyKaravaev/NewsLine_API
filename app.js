const mongoose = require("mongoose");
const express = require("express");
const router = require('./routers/user-routers');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const News = require('./model/user-model');
const jwt = require('jsonwebtoken');

const MONGO_DB = "mongodb://localhost:27017/newsline";
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(router);
app.use("/api", router);
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

main();
//Прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {

    await mongoose.disconnect();

    console.log("Приложение завершило работу");

    process.exit();
});