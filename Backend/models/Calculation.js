const mongoose = require("mongoose");


const calculationSchema = new mongoose.Schema(
    {
        dividend: {
            type: Number,
            required: true
        },

        divisor: {
            type: Number,
            required: true
        },

        quotient: {
            type: Number,
            required: true
        },

        remainder: {
            type: Number,
            required: true
        },

                user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Calculation", calculationSchema);