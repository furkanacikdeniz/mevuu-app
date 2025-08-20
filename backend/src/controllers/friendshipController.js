// src/controllers/friendshipController.js
const Friendship = require('../models/Friendship');
const ManualUser = require('../models/ManualUser');
const User = require('../models/User');


exports.getUserRelations = async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1) User ↔ User
        // User ↔ User
        const userFr = await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }]
        })
            .populate('user1 user2', 'username')
            .select('user1 user2 relationType sinceDate')
            .lean();

        // User ↔ ManualUser
        const manualFr = await Friendship.find({
            $or: [{ user1: userId }, { man2: userId }]
        })
            .populate('user1', 'username')
            .populate('man2', 'username')
            .select('user1 man2 relationType sinceDate')
            .lean();
        const all = [...userFr, ...manualFr];

        const friends = manualFr
            .filter(f => f.relationType === 'friend')
            .map(f => ({
                _id: f.man2?._id || f.user2?._id,
                username: f.man2?.username || f.user2?.username,
                sinceDate: f.sinceDate.toISOString()
            }));

        // partner için
        const partner = manualFr
            .filter(f => f.relationType === 'partner')
            .map(f => ({
                _id: f.user2?._id || f.man2?._id,
                username: f.user2?.username || f.man2?.username || 'Misafir',
                sinceDate: f.sinceDate.toISOString().split('T')[0]
            }))

        res.json({ friends, partner });
    } catch (err) {
        console.error('500 DETAY:', err.message, err.stack);
        res.status(500).json({ success: false, message: err.message });
    }
};
// POST /api/friendships/add   (iki gerçek User arasında)
exports.addFriend = async (req, res) => {
    try {
        const { user1, user2, relationType } = req.body;
        if (!user1 || !user2 || !relationType) {
            return res.status(400).json({ success: false, message: 'Eksik alan' });
        }
        const friendship = new Friendship({
            user1,
            user2,
            relationType,
            sinceDate: new Date()
        });
        await friendship.save();
        res.status(201).json({ success: true, friendship });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};

// POST /api/friendships/addManual   (gerçek User ↔ ManualUser)
exports.manualAddFriend = async (req, res) => {
    try {
        const { username, firstName, lastName, gender, birthDate, addedBy, relationType } = req.body;

        // 1) Manuel kullanıcı yarat
        const manualUser = await ManualUser.create({
            username: username.toLowerCase().trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender,
            birthDate,
            addedBy: req.user ? req.user._id : addedBy,
            relationType
        });

        // 2) İlişkiyi kaydet
        const friendship = new Friendship({
            user1: req.user ? req.user._id : addedBy,
            man2: manualUser._id,
            relationType,
            sinceDate: new Date()
        });
        await friendship.save();

        res.status(201).json({
            success: true,
            message: 'Kullanıcı ve ilişki eklendi',
            user: manualUser,
            friendship
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};