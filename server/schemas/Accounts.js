const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    user: {
        type: String,
        required: true,
        trim: true,
    },
    pass: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum:["admin","user"],
        required: true,
    },
    times_rented: {
        type: Number,
        default: 0,
    },
    current_rent: {
        car_name: String,
        pick_location: String,
        drop_location: String,
        pick_date: String,
        drop_date: String,
        pick_time: String,
        drop_time: String,
    },
    review: {
        comment: String,
        stars: Number,
    }
   
},{timestamps: true});


const Account = mongoose.model("Account",accountSchema);

module.exports = Account;