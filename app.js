const mongoose = require("mongoose");
const express = require("express");
const router = require('./routers/user-routers');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require("./auth");

const MONGO_DB = "mongodb://localhost:27017/newsline";
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(router);
app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });
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

main();
//Прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {

    await mongoose.disconnect();

    console.log("Приложение завершило работу");

    process.exit();
});