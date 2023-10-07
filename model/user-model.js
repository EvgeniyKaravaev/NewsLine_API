const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, unique: true },
    password: { type: String, require: true },
    token: { type: String },
});

module.exports = mongoose.model('News', userSchema);