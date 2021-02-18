const mongoose = require("mongoose");

const schema = mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: [true, "A blackisted model document must have a token entry"]
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
})

const BlacklistedModel = mongoose.model("Blacklisted-Tokens", schema)
module.exports = BlacklistedModel;