const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
    // unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXbDPcPSHduDIi7BKwEhCCJqo7QJZg7OHX6Dlvn-NpMf8TlS8Z-s3Ra9f5nvD2hhApROc&usqp=CAU",
  },

  // lien vers la collection "User" pour savoir qui a ajouté le produit

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', //
  },
}, { timestamps: true });


const Product = mongoose.model('product', productSchema);

module.exports = Product;
