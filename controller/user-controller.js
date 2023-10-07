const News = require('../model/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const tokenKey = '1aaf-124d-54hd-fing';

const getUser = async (req, res) => {

    await News.find({}).then((news) => { res.status(200).json(news); })
        .catch((err) => { res.status(400).json({ message: err }) });
}

const getUserEmail = async (req, res) => {
    const email = req.params.email;
    await News.findOne(email).then((news) => { res.status(200).json(news); })
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

        const token = jwt.sign({ id: user.id }, tokenKey, {expiresIn: '2h'});

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

    const token = jwt.sign({ id: user.id }, tokenKey, {expiresIn: '2h'});

    user.token = token;

    await News.findOneAndUpdate({ id: user.id }, user, { new: true })
        .then((result) => { res.status(200).json(result); })
        .catch(() => { res.status(400).json({ message: 'Ошибка изменения объекта!' }) });
}

module.exports = { getUser, getUserEmail, getUserDelete, getUserPost, getUserPut };