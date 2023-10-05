const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jsonParser = express.json();
const jwt = require('jsonwebtoken');

const MONGO_DB = "mongodb://localhost:27017/newsline";

const News = require('./model/user-model');
const { getUser, getUserId, getUserDelete, getUserPost, getUserPut } = require('./controller/user-controller');

async function main() {

    try {
        await mongoose.connect(MONGO_DB);//URL Базы данных
        app.listen(3000);//Порт 3000
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
//Поиск всех пользователей
app.get("/api/users", getUser);
//Поиск пользователя по уникальному идентификатору
app.get("/api/users/:id", getUserId);
//Добавление пользователя, кодируем пароль при помощи bcrypt, получаем JWT токен
app.post("/api/users", jsonParser, getUserPost);
//Удаление пользователя
app.delete("/api/users/:id", getUserDelete);
//Изменение пользователя
app.put("/api/users", jsonParser, getUserPut);

main();
//Прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {

    await mongoose.disconnect();

    console.log("Приложение завершило работу");

    process.exit();
});