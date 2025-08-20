import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    Platform,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:4000';

const MevuuScreen = () => {
        const [partner, setPartner] = useState(null);
        const [friends, setFriends] = useState([]);
        const [loading, setLoading] = useState(true);
        const [refreshing, setRefreshing] = useState(false);
        const [showPartnerModal, setShowPartnerModal] = useState(false);
        const [partnerForm, setPartnerForm] = useState({
            username:'',
            firstName:'',
            lastName:'',
            gender:'',
            birthDate:''
        });
        const fetchRelations = async () => {
        try {
            // 1) kendi userId’mizi al (auth sonrası AsyncStorage’e yazdığını varsay)
            const userId = await AsyncStorage.getItem('userId'); // "68a45476d3796cd982d81d86"
            if (!userId) return;

            // 2) backend’den çek
            const res = await axios.get(`${BASE_URL}/api/friendships/${userId}`);
            // res.data -> { partner: {...}, friends: [...] }

            setPartner(res.data.partner?.[0] || null);
            setFriends(res.data.friends || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        AsyncStorage.getItem('userId').then(id => {
            console.log('AsyncStorage userId:', id);   // null mı, değil mi?
            if (!id) return;
            fetchRelations();
        });
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRelations();
    };

    // gün farkı
    const daysTogether = (sinceDate) => {
        if (!sinceDate) return 0;
        const d = new Date(typeof sinceDate === 'object' ? sinceDate.toString() : sinceDate);
        return Math.abs(Math.floor((Date.now() - d.getTime()) / 86400000));
    };
    /* ---------- kartlar ---------- */
    const addPartner = async () => {
        const { username, firstName, lastName, gender, birthDate } = partnerForm;
        if (!username || !firstName || !lastName || !birthDate) {
            Alert.alert('Eksik alan', 'Tüm alanları doldurun.');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('userId');
            await axios.post(`${BASE_URL}/api/friendships/addManual`, {
                username,
                firstName,
                lastName,
                gender,
                birthDate,
                relationType: 'partner',
                addedBy: userId
            });
            setShowPartnerModal(false);
            setPartnerForm({ username: '', firstName: '', lastName: '', gender: 'male', birthDate: '' });
            fetchRelations(); // anasayfada hemen göster
        } catch (err) {
            Alert.alert('Hata', err.response?.data?.message || 'Eklenemedi');
        }
    };
    const ManitaCard = ({ user }) => (
        <View style={styles.manitaCard}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <Icon name="favorite" size={24} color="#264653" />
                    <Text style={styles.username}>{user.username}</Text>
                </View>
                <TouchableOpacity style={styles.detayButton}>
                    <Text style={styles.detayText}>detay</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.dayText}>
                 {daysTogether(user.sinceDate)} gündür sevgilisiniz!
            </Text>

            <View style={styles.messageBox}>
                <Text style={styles.messageText}>
                    yıldönümünüz yaklaşıyor.
                </Text>
            </View>
        </View>
    );

    const KankaCard = ({ user }) => (
        <View style={[styles.kankaCard, { backgroundColor: '#B8E6E1' }]}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.userAvatar} />
                    <Text style={styles.username}>{user.username}</Text>
                </View>
                <TouchableOpacity style={styles.detayButton}>
                    <Text style={styles.detayText}>detay</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.dayText}>
                 {daysTogether(user.sinceDate)} gündür arkadaşsınız!
            </Text>

        </View>
    );

    /* ---------- render ---------- */
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Yükleniyor…</Text>
            </SafeAreaView>
        );
    }

    return (

        <SafeAreaView style={styles.container}>

            <Text style={styles.appTitle}>mevuu</Text>
            <StatusBar backgroundColor="#faf7f0" barStyle="dark-content" />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* SEVGİLİ – her zaman görünür */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>sevgili</Text>
                        {!partner && (
                            <TouchableOpacity onPress={() => setShowPartnerModal(true)}>
                                <Icon name="add" size={24} color="#264653" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {partner ? (
                        <ManitaCard user={partner} />
                    ) : (
                        <Text style={styles.emptyText}>Henüz bir sevgilin yok.</Text>
                    )}
                </View>

                {/* FRIENDS */}
                {friends.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>arkadaşlar</Text>
                            <TouchableOpacity style={styles.yeniButton}>
                                <Text style={styles.yeniText}>yeni</Text>
                            </TouchableOpacity>
                        </View>

                        {friends.map((f) => (
                            <KankaCard user={f} key={f._id} />
                        ))}
                    </View>
                )}
            </ScrollView>
            <Modal
                visible={showPartnerModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPartnerModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Partner Ekle</Text>

                        {['username', 'firstName', 'lastName', 'birthDate'].map(key => (
                            <TextInput
                                key={key}
                                style={styles.modalInput}
                                placeholder={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                value={partnerForm[key]}
                                onChangeText={t => setPartnerForm({...partnerForm, [key]: t})}
                            />
                        ))}

                        <View style={styles.row}>
                            <Text>Cinsiyet:</Text>
                            {['male', 'female'].map(g => (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => setPartnerForm({...partnerForm, gender: g})}
                                    style={[styles.radio, partnerForm.gender === g && styles.radioActive]}
                                >
                                    <Text>{g}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalRow}>
                            <TouchableOpacity onPress={() => setShowPartnerModal(false)}>
                                <Text style={styles.modalBtn}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addPartner}>
                                <Text style={styles.modalBtn}>Ekle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Bottom Nav (örnek) */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="people" size={28} color="#faf7f0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="search" size={28} color="#faf7f0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="person" size={28} color="#faf7f0" />
                </TouchableOpacity>
            </View>

        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf7f0',
        // Added horizontal padding to the main container
        paddingHorizontal: 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    appTitle: {paddingHorizontal:20,
        fontSize: 48,
        color: '#264653',
        fontFamily: 'Pacifico-Regular',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 25,
        paddingHorizontal:20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        marginBottom: 15,
        fontSize: 32,
        color: '#264653',
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Bold',
    },
    yeniButton: {
        backgroundColor: '#264653',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    yeniText: {
        color: '#faf7f0',
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Bold',
    },
    manitaCard: {
        backgroundColor: '#FFB6B6',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
    },
    kankaCard: {
        backgroundColor: '#bce5ed',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#264653',
        marginRight: 10,
    },
    username: {
        fontSize: 18,
        color: '#264653',
        marginLeft: 8,
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-SemiBold',
    },
    detayButton: {
        backgroundColor: '#faf7f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 15,
    },
    detayText: {
        color: '#264653',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Bold',
    },
    dayText: {
        fontSize: 16,
        color: '#264653',
        marginBottom: 15,
        lineHeight: 22,
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Regular',
    },
    messageBox: {
        backgroundColor: '#ff7676',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
    },
    messageText: {
        fontSize: 16,
        color: '#264653',
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Medium',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 15,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalBtn: { fontSize: 16, color: '#007AFF' },
    bottomText: {
        fontSize: 15,
        color: '#264653',
        lineHeight: 20,
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Regular',
    },
    bottomNavigation: {
        flexDirection: 'row',
        backgroundColor: '#264653',
        paddingVertical: 15,
        // Adjusted horizontal padding to match the rest of the screen
        paddingHorizontal: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    navItem: {
        padding: 10,
    },
    heartIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    navIcon: {
        fontSize: 24,
    },
    // Eksik font family'ler eklendi:
    allText: {
        fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Regular',
    },
});

export default MevuuScreen;
