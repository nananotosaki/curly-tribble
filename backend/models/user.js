const mongoose = require("mongoose");

const Userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("User", Userschema);