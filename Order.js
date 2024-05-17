
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    // status: {
    //     type: String,
    //     default: 'pending'
    // },
   
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
