const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required:true
    }
},{
    timestamps: true
});

module.exports =mongoose.model('Product', productSchema);