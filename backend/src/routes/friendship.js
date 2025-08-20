// src/routes/friendship.js
const express = require('express');
const router = express.Router();
const {
    getUserRelations,
    addFriend,
    manualAddFriend
} = require('../controllers/friendshipController');

router.get('/:userId', getUserRelations);
router.post('/add', addFriend);
router.post('/addManual', manualAddFriend);

module.exports = router;