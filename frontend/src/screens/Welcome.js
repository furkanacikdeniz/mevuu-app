import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions} from 'react-native';
import { createStackNavigator, useNavigation } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const height = Dimensions.get('window').height;
export default function WelcomeScreen({ navigation }) {

  return (
      <ImageBackground source={require('../assets/ilksayfa.png')} style={{width:'100%',height:'100%'}}  >
          <View style={styles.container}>
              <View style={styles.description}>
                  <Text style={styles.desc1}>
                      Sevdiklerinle olan özel günleri unutma!
                  </Text>
                  <Text style={styles.desc2}>
                      Doğum günleri, yıldönümleri ve tüm önemli tarihleri buraya kaydedebilir, zamanı geldiğinde hatırlatma alabilirsin.
                  </Text>
                  <Text style={styles.desc1}>
                      Hazır mısın?
                  </Text>
              </View>
              <View>
                  <View style={styles.buttons}>
                      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.register}>
                          <Text style={styles.buttonText}>
                              Hesap Aç
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.login}>
                          <Text style={styles.buttonText}>
                              Giriş Yap
                          </Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
      marginTop:'65%',
      padding: '7%',
      justifyContent: 'center', // Description'ı dikeyde ortalar
      alignItems: 'center',
      textAlign:'center',

  },
    description: {
        justifyContent: 'center', // Description'ı dikeyde ortalar
        alignItems: 'center',
    },
    desc1:{
        marginBottom:30,
        marginTop:10,
      fontFamily:'JosefinSans-Bold',
        fontSize: 30,
        color:'#333333'

    },
    desc2:{
        marginTop:20,
        fontFamily:'JosefinSans-SemiBold',
        fontSize: 21,
        color:'#333333'
    },
    buttons:{
      flexDirection:'row',
    },
    register:{
      justifyContent:'center',
        marginRight:'5%',
        backgroundColor:'#c35b2f',
        paddingVertical:5,
        paddingHorizontal:35,
        borderRadius:10,
    },
    login:{
        paddingVertical:5,
        paddingHorizontal:35,
        borderRadius:10,
        justifyContent:'center',
        backgroundColor:'#264653',
    },
    buttonText:{
        color:'#faf7f0',
        fontFamily:'JosefinSans-Bold',
        fontSize:20,
        marginBottom:5,
    }
});