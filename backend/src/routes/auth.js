const express = require('express');
const { listUsers, registerUser, loginUser, deleteUser } = require('../controllers/authController');
const router = express.Router();

router.get('/users', listUsers)
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.delete('/deleteUser/:id', deleteUser);
module.exports = router;
