import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

/* ---------- sabit listeler ---------- */
const genderOptions = [
    { label: 'erkek', value: 'Erkek' },
    { label: 'kadın', value: 'Kadın' },
    { label: 'diğer', value: 'Diğer' },
];

const months = [
    { label: 'ocak', value: '01' }, { label: 'şubat', value: '02' },
    { label: 'mart', value: '03' }, { label: 'nisan', value: '04' },
    { label: 'mayıs', value: '05' }, { label: 'haziran', value: '06' },
    { label: 'temmuz', value: '07' }, { label: 'ağustos', value: '08' },
    { label: 'eylül', value: '09' }, { label: 'ekim', value: '10' },
    { label: 'kasım', value: '11' }, { label: 'aralık', value: '12' },
];

/* ---------- yardımcılar ---------- */
const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 101 }, (_, i) => ({
        label: (currentYear - i).toString(),
        value: (currentYear - i).toString(),
    }));
};

const generateDays = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
        label: (i + 1).toString().padStart(2, '0'),
        value: (i + 1).toString().padStart(2, '0'),
    }));
};

/* ---------- dropdown ---------- */
const CustomDropdown = ({ selectedValue, onSelect, placeholder, options }) => {
    const [visible, setVisible] = useState(false);
    const [anim] = useState(new Animated.Value(0));

    const open = () => {
        setVisible(true);
        Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    };

    const close = () => {
        Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
            setVisible(false)
        );
    };

    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.dropdownButton} onPress={open}>
                <Text style={styles.dropdownButtonText}>
                    {selectedValue
                        ? options.find((o) => o.value === selectedValue)?.label
                        : placeholder}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Modal transparent visible={visible} onRequestClose={close}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={close}>
                    <View style={styles.modalContainer}>
                        <Animated.View
                            style={[styles.dropdownContainer, { transform: [{ scale }], opacity: anim }]}
                        >
                            <View style={styles.dropdownHeader}>
                                <Text style={styles.dropdownTitle}>{placeholder}</Text>
                            </View>
                            <ScrollView style={{ maxHeight: height * 0.4 }}>
                                {options.map((opt, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.option, selectedValue === opt.value && styles.selectedOption]}
                                        onPress={() => {
                                            onSelect(opt.value);
                                            close();
                                        }}
                                    >
                                        <Text style={styles.optionText}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

/* ---------- date picker ---------- */
const DatePickerModal = ({ isVisible, onClose, onDateSelect, selectedDate }) => {
    const [day, setDay] = useState(selectedDate?.day || '');
    const [month, setMonth] = useState(selectedDate?.month || '');
    const [year, setYear] = useState(selectedDate?.year || '');
    const [anim] = useState(new Animated.Value(0));

    React.useEffect(() => {
        if (isVisible) {
            Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        } else {
            Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
    }, [isVisible]);

    const handleConfirm = () => {
        if (day && month && year) {
            onDateSelect({ day, month, year, formatted: `${year}-${month}-${day}` });
            onClose();
        } else {
            Alert.alert('Lütfen tüm alanları seçin');
        }
    };

    const days = month && year ? generateDays(parseInt(month), parseInt(year)) : generateDays(12, 2024);

    return (
        <Modal transparent visible={isVisible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContainer}>
                    <Animated.View
                        style={[styles.datePickerContainer, { transform: [{ scale: anim }], opacity: anim }]}
                    >
                        <View style={styles.dropdownHeader}>
                            <Text style={styles.dropdownTitle}>doğum tarihin</Text>
                        </View>
                        <View style={styles.dateRow}>
                            <View style={styles.dateColumn}>
                                <Text style={styles.dateLabel}>gün</Text>
                                <CustomDropdown
                                    selectedValue={day}
                                    onSelect={setDay}
                                    placeholder="gün"
                                    options={days}
                                />
                            </View>
                            <View style={styles.dateColumn}>
                                <Text style={styles.dateLabel}>ay</Text>
                                <CustomDropdown
                                    selectedValue={month}
                                    onSelect={setMonth}
                                    placeholder="ay"
                                    options={months}
                                />
                            </View>
                            <View style={styles.dateColumn}>
                                <Text style={styles.dateLabel}>yıl</Text>
                                <CustomDropdown
                                    selectedValue={year}
                                    onSelect={setYear}
                                    placeholder="yıl"
                                    options={generateYears()}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>tamam</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

/* ---------- ana ekran ---------- */
export default function Register() {
    const navigation = useNavigation();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
    const handleDateSelect = ({ formatted }) => handleChange('birthDate', formatted);

    const handleRegister = async () => {
        const empty = Object.values(form).some((v) => !v?.toString().trim());
        if (empty) {
            Alert.alert('Boş Alan', 'Tüm alanları doldurman gerekiyor :)');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://10.0.2.2:3000/api/registerUser', form);
            Alert.alert('Başarılı', 'Hesabınız oluşturuldu!');
            navigation.navigate('Home');
        } catch (err) {
            Alert.alert('Hata', err.response?.data?.message || 'Bir sorun oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>mevuu</Text>

                <View style={styles.card}>
                    <Text style={styles.headline}>hesap oluştur</Text>

                    {/* kullanıcı adı */}
                    <TextInput
                        style={styles.input}
                        placeholder="kullanıcıadı"
                        placeholderTextColor="#264653"
                        value={form.username}
                        onChangeText={(v) => handleChange('username', v)}
                    />

                    {/* e-posta */}
                    <TextInput
                        style={styles.input}
                        placeholder="e-posta adresin"
                        keyboardType="email-address"
                        placeholderTextColor="#264653"
                        value={form.email}
                        onChangeText={(v) => handleChange('email', v)}
                    />

                    {/* isim / soyisim */}
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="isim"
                            placeholderTextColor="#264653"
                            value={form.firstName}
                            onChangeText={(v) => handleChange('firstName', v)}
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="soyisim"
                            placeholderTextColor="#264653"
                            value={form.lastName}
                            onChangeText={(v) => handleChange('lastName', v)}
                        />
                    </View>

                    {/* cinsiyet & doğum tarihi */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <CustomDropdown
                                selectedValue={form.gender}
                                onSelect={(v) => handleChange('gender', v)}
                                placeholder="cinsiyetin"
                                options={genderOptions}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setDatePickerVisible(true)}
                            >
                                <Text style={styles.dropdownButtonText}>
                                    {form.birthDate || 'doğum tarihin'}
                                </Text>
                                <Text style={styles.dropdownArrow}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* parola */}
                    <TextInput
                        style={styles.input}
                        placeholder="parola"
                        placeholderTextColor="#264653"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(v) => handleChange('password', v)}
                    />

                    {/* kayıt butonu */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'yükleniyor...' : 'hesap oluştur'}
                        </Text>
                    </TouchableOpacity>

                    {/* giriş linki */}
                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>"e benim hesabım var" diyorsan</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signInLink}>giriş yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <DatePickerModal
                    isVisible={datePickerVisible}
                    onClose={() => setDatePickerVisible(false)}
                    onDateSelect={handleDateSelect}
                    selectedDate={
                        form.birthDate
                            ? {
                                day: form.birthDate.split('-')[2],
                                month: form.birthDate.split('-')[1],
                                year: form.birthDate.split('-')[0],
                            }
                            : null
                    }
                />
            </View>
        </ScrollView>
    );
}

/* ------------------------------ STYLES ------------------------------ */
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#faf7f0',
    },
    container: {
        flex: 1,
        backgroundColor: '#faf7f0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    title: {
        fontFamily: 'Pacifico-Regular',
        fontSize: 60,
        color: '#264653',
        marginBottom: 30,
    },
    card: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 32,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    headline: {
        fontFamily: 'JosefinSans-Bold',
        fontSize: 26,
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 46,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        paddingHorizontal: 12,
        fontFamily: 'JosefinSans-Regular',
        fontSize: 16,
        color: '#333',
        marginBottom: 14,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 14,
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 1,
        marginHorizontal: 4,
    },
    dropdownButton: {
        height: 46,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownButtonText: {
        fontFamily: 'JosefinSans-Regular',
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#c35b2f',
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#c35b2f',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    disabled: {
        backgroundColor: '#aaa',
    },
    buttonText: {
        fontFamily: 'JosefinSans-Bold',
        fontSize: 18,
        color: '#fff',
    },
    signInContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signInText: {
        fontFamily: 'JosefinSans-SemiBold',
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    signInLink: {
        fontFamily: 'JosefinSans-Bold',
        fontSize: 16,
        color: '#c35b2f',
    },
    confirmButton: {
        backgroundColor: '#c35b2f',
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    confirmButtonText: {
        fontFamily: 'JosefinSans-Bold',
        fontSize: 16,
        color: '#fff',
    },

    /* Modal stilleri */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
    },
    dropdownContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    dropdownHeader: {
        backgroundColor: '#264653',
        paddingVertical: 14,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    dropdownTitle: {
        fontFamily: 'JosefinSans-Bold',
        fontSize: 20,
        color: '#faf7f0',
        textAlign: 'center',
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 2,
    },
    selectedOption: {
        backgroundColor: '#e0e0e0',
    },
    optionText: {
        fontFamily: 'JosefinSans-Regular',
        fontSize: 18,
        color: '#333',
    },
    datePickerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        elevation: 10,
        paddingBottom: 14,
    },
    dateRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    dateColumn: {
        flex: 1,
        marginHorizontal: 4,
    },
    dateLabel: {
        fontFamily: 'JosefinSans-SemiBold',
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
});