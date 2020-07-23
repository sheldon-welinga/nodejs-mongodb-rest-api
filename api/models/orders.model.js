const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',  //Adding a reference to the product model(relationship)
        required: true
    },
    quantity: {
        type: Number,
        // required: true,
        default: 1
    }
});

module.exports = mongoose.model("Order", orderSchema);