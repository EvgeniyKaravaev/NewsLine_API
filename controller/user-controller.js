const News = require('../model/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const tokenKey = '1aaf-124d-54hd-fing';

const getUser = async (req, res) => {

    await News.find({}).then((news) => { res.status(200).json(news); })
        .catch((err) => { res.status(400).json({ message: err }) });
}

const getUserId = async (req, res) => {
    const id = req.params.id;
    await News.findById(id).then((news) => { res.status(200).json(news); })
        .catch(() => { res.status(400).json({ message: 'Проверьте корректность уникального идентификатора - ID' }) });
}

const getUserDelete = async (req, res) => {
    const id = req.params.id;
    await News.findByIdAndDelete((id))
        .then((result) => { res.status(200).json(result); })
        .catch(() => { res.status(400).json({ message: 'Ошибка, проверьте корректность уникального идентификатора - ID!' }) });
}

const getUserPost = async (req, res) => {

    try {

        const { first_name, last_name, email, password } = req.body;

        encryptedPassword = await bcrypt.hash(password, 10);

        if (!(email && password && first_name && last_name)) return res.status(400);

        const userFirstName = first_name;

        const userLastName = last_name;

        const userEmail = email;

        const userPassword = encryptedPassword;

        const user = new News({ first_name: userFirstName, last_name: userLastName, email: userEmail, password: userPassword });

        const token = jwt.sign({ id: user.id }, tokenKey, { expiresIn: '2h' });

        user.token = token;

        await user.save().then((result) => { res.status(200).json(result); });

    } catch (err) {
        return res.status(400).json({ message: 'Пользователь уже зарегистрирован!' });
    }
}

const getUserPut = async (req, res) => {

    const { first_name, last_name, email, password } = req.body;

    encryptedPassword = await bcrypt.hash(password, 10);

    if (!(email && password && first_name && last_name)) return res.status(400);

    const userFirstName = first_name;

    const userLastName = last_name;

    const userEmail = email;

    const userPassword = encryptedPassword;

    const user = { first_name: userFirstName, last_name: userLastName, email: userEmail, password: userPassword };

    const token = jwt.sign({ id: user.id }, tokenKey, { expiresIn: '2h' });

    user.token = token;

    await News.findOneAndUpdate({ id: user.id }, user, { new: true })
        .then((result) => { res.status(200).json(result); })
        .catch(() => { res.status(400).json({ message: 'Ошибка изменения объекта!' }) });
}

const getLoginPost = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("Вы ввели не все данные");
        }
        const user = await News.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign(
                { id: user.id, email },
                tokenKey,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200).json(user);
        }
        res.status(400).send("Неверные учетные данные");
    } catch (err) {
        console.log(err);
    }
}

module.exports = { getUser, getUserId, getUserDelete, getUserPost, getUserPut, getLoginPost };