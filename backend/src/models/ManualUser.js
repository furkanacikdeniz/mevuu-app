// models/ManualUser.js
const mongoose = require('mongoose');

const ManualUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    firstName: String,
    lastName: String,
    gender: String,
    birthDate: Date,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    relationType: { type: String, enum: ['friend', 'partner'] }
}, { timestamps: true });

module.exports = mongoose.model('ManualUser', ManualUserSchema);