const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, unique: true },
  
}, { timestamps: false });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);

