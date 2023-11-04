const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    carname: {
        type: String,
        required: true,
    },
    card_type: {
        type: String,
        enum: ['Debit', 'Credit'], // Assuming card_type can only be 'Debit' or 'Credit'
        required: true,
    },
    car_type: {
        type: String,
        required: true,
    },
    rent_price: {
        type: Number,
        required: true,
    },
    rental_agency: {
        type: String,
        required: true,
    },
    wanted: {
        type: Number,
        required: true,
    },
    agency_commission: {
        type: Number,
        required: true,
    }
   
},{timestamps: true});


const Account = mongoose.model("Car",accountSchema);

module.exports = Account;