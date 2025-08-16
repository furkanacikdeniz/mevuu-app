import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Uyarı', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://10.0.2.2:3000/api/loginUser', {
        email,
        password,
      });
      Alert.alert('Başarılı', 'Giriş başarılı!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert(
        'Hata',
        err.response?.data?.message || 'Bir sorun oluştu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>mevuu</Text>

      <View style={styles.card}>
        <Text style={styles.headline}>Giriş Yap</Text>

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Parola</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}>
          <Text style={styles.buttonText}>
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Hesap Oluştur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------------------- STYLES -------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f0', // same light background as Welcome
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  title: {
    fontFamily: 'Pacifico-Regular',
    fontSize: 80,
    color: '#264653', // dark teal from Welcome
    marginBottom: 40,
  },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headline: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 28,
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },

  label: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'JosefinSans-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#264653', // dark teal
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },

  disabled: {
    backgroundColor: '#aaa',
  },

  buttonText: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 18,
    color: '#faf7f0',
  },

  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  secondaryText: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 16,
    color: '#c35b2f', // orange tone from Welcome
  },
});