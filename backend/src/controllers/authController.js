const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json({ success: true, users });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });

    }
};
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, gender, birthDate } = req.body;

        const cleanEmail = email?.trim().toLowerCase();
        const cleanUsername = username?.trim().toLowerCase();

        if (!cleanUsername || !cleanEmail || !password) {
            return res.status(400).json({ success: false, message: 'Kullanıcı adı, e-posta ve parola zorunludur' });
        }

        const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
        if (existing) {
            return res.status(409).json({ success: false, message: 'E-posta veya kullanıcı adı zaten kullanılıyor' });
        }

        const user = new User({
            username: cleanUsername,
            email: cleanEmail,
            password,
            profile: { firstName, lastName, gender, birthDate }
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            token,
            user: { id: user._id, username: user.username, email: user.email, profile: user.profile }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'Geçersiz email veya parola' });


        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return res.status(400).json({ success: false, message: 'Geçersiz email veya parola' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: 'Giriş başarılı',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });

        res.json({ success: true, message: 'Kullanıcı başarıyla silindi' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};
