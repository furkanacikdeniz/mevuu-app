const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // giriş yapan
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // arkadaş
    relationType: { type: String, enum: ['friend', 'partner'], default: 'friend' },
    sinceDate: { type: Date, required: true }, // ilişkiler başladığı tarih
    specialNotes: String
}, { timestamps: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);
