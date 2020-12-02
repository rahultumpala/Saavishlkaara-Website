const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: [true, "Please Provide a Username"]
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please provide a Password"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        minLength: 6,
        validate: {
            // This works only on CREATE and SAVE
            validator: function (el) {
                return el == this.password;
            },
            message: "passwords are not the same"
        },
        required: [true, 'Please confirm the password']
    },
    phoneNumber: {
        type: Number,
        minlength: 10,
        maxLength: 10,
    },
    collegeName: {
        type: String,
    },
    branchName: {
        type: String,
    },
    qualification: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "tutor", 'user'],
        default: "user",
    }
})


userSchema.pre("save", async function (next) {
    // only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // hash the password with the cost of 9
    this.password = await bcrypt.hash(this.password, 9);

    //Delete passwordConfirm Field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.methods.correctPassword = async function (candidatePwd, userPwd) {
    return await bcrypt.compare(candidatePwd, userPwd);
}

const User = mongoose.model('UserModel', userSchema);
module.exports = User;