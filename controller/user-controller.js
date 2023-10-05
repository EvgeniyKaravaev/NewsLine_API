const News = require('../model/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const tokenKey = '1a2b-3c4d-5e6f-7g8h';

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

        encryptedPassword = await bcrypt.hash(req.body.password, 10);

        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) return res.status(400);

        const userFirstName = req.body.first_name;

        const userLastName = req.body.last_name;

        const userEmail = req.body.email;

        const userPassword = encryptedPassword;

        const user = new News({ first_name: userFirstName, last_name: userLastName, email: userEmail, password: userPassword });

        const token = jwt.sign({ id: user.id }, tokenKey);

        user.token = token;

        await user.save().then((result) => { res.status(200).json(result); });

    } catch (err) {
        return res.status(400).json({ message: 'Пользователь уже зарегистрирован!' });
    }
}

const getUserPut = async (req, res) => {

    encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) return res.status(400);

    const userFirstName = req.body.first_name;

    const userLastName = req.body.last_name;

    const userEmail = req.body.email;

    const userPassword = encryptedPassword;

    const user = { first_name: userFirstName, last_name: userLastName, email: userEmail, password: userPassword };

    const token = jwt.sign({ id: user.id }, tokenKey);

    user.token = token;

    await News.findOneAndUpdate({ id: user.id }, user, { new: true })
        .then((result) => { res.status(200).json(result); })
        .catch(() => { res.status(400).json({ message: 'Ошибка изменения объекта!' }) });
}

module.exports = { getUser, getUserId, getUserDelete, getUserPost, getUserPut };