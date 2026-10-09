const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
    },

    phone: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        required: true,
        min: 18,
        max: 65
    },

    bloodGroup: {
        type: String,
        required: true,
        enum: [
            "A+","A-",
            "B+","B-",
            "AB+","AB-",
            "O+","O-"
        ]
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["donor", "admin"],
        default: "donor"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);