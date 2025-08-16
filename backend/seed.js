const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Friendship = require('./src/models/Friendship');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

async function seedData() {
    try {
        // 1. Önce eski verileri temizleyelim
        await User.deleteMany({});
        await Friendship.deleteMany({});

        // 2. Kullanıcıları oluştur
        const me = new User({
            username: 'furkan',
            email: 'furkan@example.com',
            password: '123456',
            profile: {
                firstName: 'Furkan',
                lastName: 'Açıkdeniz',
                gender: 'male',
                birthDate: new Date(2000, 5, 15), // 15 Haziran
                profileImage: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=F' // örnek resim
            }
        });

        const friend1 = new User({
            username: 'ahmet',
            email: 'ahmet@example.com',
            password: '123456',
            profile: {
                firstName: 'Ahmet',
                lastName: 'Yılmaz',
                gender: 'male',
                birthDate: new Date(1999, 7, 20), // 20 Ağustos
                profileImage: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=A'
            }
        });

        const partner = new User({
            username: 'ayse',
            email: 'ayse@example.com',
            password: '123456',
            profile: {
                firstName: 'Ayşe',
                lastName: 'Demir',
                gender: 'female',
                birthDate: new Date(2001, 7, 16), // 16 Ağustos (yakın doğum günü)
                profileImage: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Ay'
            }
        });

        await me.save();
        await friend1.save();
        await partner.save();

        // 3. Arkadaşlıkları ekle
        await Friendship.create([
            {
                user1: me._id,
                user2: friend1._id,
                relationType: 'friend',
                sinceDate: new Date(2023, 0, 1) // 1 Ocak 2023
            },
            {
                user1: me._id,
                user2: partner._id,
                relationType: 'partner',
                sinceDate: new Date(2024, 5, 10) // 10 Haziran 2024
            }
        ]);

        console.log('✅ Örnek veriler eklendi');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedData();
