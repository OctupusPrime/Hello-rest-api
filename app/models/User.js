const {Schema, model} = require("mongoose");

const User = new Schema({
    email: {required: true, type: String, unique: true},
    password: {required: true, type: String}
});

model("User", User);