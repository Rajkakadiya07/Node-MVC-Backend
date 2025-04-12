const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        min: [8, 'Min 8 character required'],
        max: [20, 'Maximum 20 character allowed']
    },
    avatar: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
       
    }

}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
   return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    },
        process.env.S_KEY,
        {
            expiresIn: '1d'
        }
    )
}

userSchema.methods.generaterefreshToken = async function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.R_KEY,
        {
            expiresIn: '10d'
        }
    )
}

const userModel = mongoose.model("User", userSchema);
module.exports = { userModel };



