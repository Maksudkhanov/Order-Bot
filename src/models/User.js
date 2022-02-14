const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  telegramId: {
    type: Schema.Types.Number,
    required: true,
    unique: true,
  },
  language: {
      type: Schema.Types.String
  },
  phoneNumber: {
    type: Schema.Types.String
  }
});

module.exports = mongoose.model("User", userSchema);
