// models/Friendship.js
const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    man2: { type: mongoose.Schema.Types.ObjectId, ref: 'ManualUser', required: false },
    relationType: { type: String, enum: ['friend', 'partner'], required: true },
    sinceDate: { type: Date, default: Date.now }        // ← kesin var
}, { timestamps: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);