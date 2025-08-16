import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // İkon paketi olmadan

const MevuuScreen = () => {
  const ManitaCard = () => (
    <View style={styles.manitaCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Icon name="favorite" size={24} color="#012758" />
          <Text style={styles.username}>kullanıcıadı</Text>
        </View>
        <TouchableOpacity style={styles.detayButton}>
          <Text style={styles.detayText}>detay</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dayText}>💖 322 gündür manitasınızz 🥳 ohaaaa..! 🎯</Text>

      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          yıldönümünüz yaklaşıyor. plan yap da trip atmasın!
        </Text>
      </View>

      <Text style={styles.bottomText}>
        size özel tarihleri görmek için detay'a tıkla
      </Text>
    </View>
  );

  const KankaCard = () => (
    <View style={styles.kankaCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar} />
          <Text style={styles.username}>kullanıcıadı</Text>
        </View>
        <TouchableOpacity style={styles.detayButton}>
          <Text style={styles.detayText}>detay</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dayText}>🤗 1021 gündür kankasınız 🥳 ohaaaa..! 🎯</Text>

      <Text style={styles.bottomText}>
        size özel tarihleri görmek için detay'a tıkla
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFD882" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.appTitle}>mevuu</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>manita</Text>
          <ManitaCard />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>kankalar</Text>
            <TouchableOpacity style={styles.yeniButton}>
              <Text style={styles.yeniText}>yeni</Text>
            </TouchableOpacity>
          </View>

          <KankaCard />
          <View style={[styles.kankaCard, { backgroundColor: '#B8E6E1' }]}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar} />
                <Text style={styles.username}>kullanıcıadı</Text>
              </View>
              <TouchableOpacity style={styles.detayButton}>
                <Text style={styles.detayText}>detay</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.dayText}>🤗 1021 gündür kankasınız 🥳 ohaaaa..! 🎯</Text>

            <Text style={styles.bottomText}>
              size özel tarihleri görmek için detay'a tıkla
            </Text>
          </View>

          <View style={[styles.kankaCard, { backgroundColor: '#D4C5F9' }]}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar} />
                <Text style={styles.username}>kullanıcıadı</Text>
              </View>
              <TouchableOpacity style={styles.detayButton}>
                <Text style={styles.detayText}>detay</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.dayText}>🤗 1021 gündür kankasınız 🥳 ohaaaa..! 🎯</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="people" size={28} color="#FFD882" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="search" size={28} color="#FFD882" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={28} color="#FFD882" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD882',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 48,
    color: '#012758',
    fontFamily: 'Pacifico-Regular',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
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
    color: '#012758',
    fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Bold',
  },
  yeniButton: {
    backgroundColor: '#012758',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  yeniText: {
    color: '#FFD882',
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
    backgroundColor: '#012758',
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    color: '#012758',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-SemiBold',
  },
  detayButton: {
    backgroundColor: '#FFD882',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  detayText: {
    color: '#012758',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Bold',
  },
  dayText: {
    fontSize: 16,
    color: '#012758',
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
    color: '#012758',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Medium',
  },
  bottomText: {
    fontSize: 15,
    color: '#012758',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Josefin Sans' : 'JosefinSans-Regular',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#012758',
    paddingVertical: 15,
    paddingHorizontal: 40,
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