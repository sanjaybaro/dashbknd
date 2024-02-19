const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    profileImage: String,
    userName: String,
    phoneNumber: Number


}, {
    versionKey: false
})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}