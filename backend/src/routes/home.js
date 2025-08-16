const express = require('express');
const router = express.Router();
const Friendship = require('../models/Friendship');
const User = require('../models/User');

// /home/:userId
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Arkadaşlıkları bul (benim arkadaş olduğum kişiler)
        const friends = await Friendship.find({ user1: userId })
            .populate('user2', 'profile.firstName profile.lastName profile.profileImage profile.birthDate');

        // Kart verisini oluştur
        const cards = friends.map(friendship => {
            const friend = friendship.user2;

            // Kaç gündür tanışıyoruz
            const daysTogether = Math.floor(
                (new Date() - new Date(friendship.sinceDate)) / (1000 * 60 * 60 * 24)
            );

            // Doğum günü yaklaşıyor mu
            const birthDate = friend.profile.birthDate;
            let isBirthdayNear = false;
            if (birthDate) {
                const now = new Date();
                const upcomingBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                const diffDays = Math.floor((upcomingBirthday - now) / (1000 * 60 * 60 * 24));
                isBirthdayNear = diffDays >= 0 && diffDays <= 7; // 7 gün içinde
            }

            return {

                name: `${friend.profile.firstName} ${friend.profile.lastName}`,
                profileImage: friend.profile.profileImage,
                daysTogether,
                isBirthdayNear
            };
        });

        res.json(cards);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
