const News = require('../model/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const tokenKey = '1a2b-3c4d-5e6f-7g8h';

const getUser = async (req, res) => {
    await News.find({}).then((news) => { res.status(200).json(news); });
}

const getUserId = async (req, res) => {
    const id = req.params.id;
    await News.findById(id).then((news) => { res.status(200).json(news); });
}

const getUserDelete = async (req, res) => {
    const id = req.params.id;
    await News.findByIdAndDelete((id)).then((result) => { res.status(200).json(result); });
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

    if (!req.body) return res.sendStatus(400);

    const id = req.body.id;

    const userFirstName = req.body.first_name;

    const userLastName = req.body.last_name;

    const userEmail = req.body.email;

    const userPassword = req.body.password;

    const newUser = new News({ first_name: userFirstName, last_name: userLastName, email: userEmail, password: userPassword });
    
    await News.findOneAndUpdate({ _id: id }, newUser, { new: true }).then((result) => { res.status(200).json(result); });
}

module.exports = {getUser, getUserId, getUserDelete, getUserPost, getUserPut};