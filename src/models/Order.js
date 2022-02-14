const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: {
    type: Schema.Types.Number
  },
  username: {
    type: Schema.Types.String,
    required: true,
  },
  phoneNumber: {
    type: Schema.Types.String,
    required: true,
    min: 13,
    max: 13,
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
    min: 1,
  },
  sum: {
    type: Schema.Types.Number,
    required: true,
    min: 1,
  },
  typeOfPayment: {
    type: Schema.Types.String,
    required: true
  },
  location: {
    latitude: {
      type: Schema.Types.Number
    },
    longitude: {
      type: Schema.Types.Number
    }
  },
  status: {
    type: Schema.Types.String,
    enum: ['PG', 'PNG', 'NP'],
    default: 'NP'
  }
}, {timestamps: true});


module.exports = mongoose.model("Order", orderSchema);
