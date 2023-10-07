const jwt = require("jsonwebtoken");

const tokenKey = '1aaf-124d-54hd-fing';

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("Для аутентификации необходим токен");
    }
    try {
        const decoded = jwt.verify(token, tokenKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Невалидный Token");
    }
    return next();
};

module.exports = verifyToken;