import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/FireBaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true); 

  useEffect(() => {
    const getDarkModePreference = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkModeEnabled(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.error('Error al recuperar el modo oscuro: ', error);
      }
    };

    getDarkModePreference();
  }, []);

  const handleContactUs = () => {
    const phoneNumber = '+5492944617762'; 
    const url = `https://wa.me/${phoneNumber}?text=Necesito Asesoramiento`;
    Linking.openURL(url).catch((err) => console.error('Error al abrir WhatsApp', err));
  };

  const handleInstagram = () => {
    const url = ``;
    Linking.openURL(url).catch((err) => console.error('Error al abrir Instagram', err));
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        Alert.alert('Cierre de sesión', 'Has cerrado sesión correctamente');
        navigation.replace('Login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión: ', error);
        Alert.alert('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo.');
      });
  };

  const toggleDarkMode = async (value) => {
    try {
      setDarkModeEnabled(value);
      await AsyncStorage.setItem('darkMode', JSON.stringify(value));
    } catch (error) {
      console.error('Error al guardar el modo oscuro: ', error);
    }
  };

  const dynamicStyles = darkModeEnabled ? styles.darkMode : styles.lightMode;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Cuenta</Text>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="person-circle-outline" size={24} color={dynamicStyles.textColor} />
            <Text style={dynamicStyles.optionText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Preferencias</Text>
          <View style={[styles.optionButton, dynamicStyles.optionButton]}>
            <Ionicons name="notifications-outline" size={24} color={dynamicStyles.textColor} />
            <Text style={dynamicStyles.optionText}>Notificaciones</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#8B6A60" : "#aaa"}
            />
          </View>
          <View style={[styles.optionButton, dynamicStyles.optionButton]}>
            <Ionicons name="moon-outline" size={24} color={dynamicStyles.textColor} />
            <Text style={dynamicStyles.optionText}>{darkModeEnabled ? 'Modo Claro' : 'Modo Oscuro'}</Text>
            <Switch
              value={!darkModeEnabled}
              onValueChange={() => toggleDarkMode(!darkModeEnabled)}
              thumbColor={!darkModeEnabled ? "#8B6A60" : "#aaa"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Soporte</Text>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={handleContactUs}>
            <Ionicons name="chatbubble-outline" size={24} color={dynamicStyles.textColor} />
            <Text style={dynamicStyles.optionText}>Contáctanos - WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={handleInstagram}>
            <Ionicons name="logo-instagram" size={24} color={dynamicStyles.textColor} />
            <Text style={dynamicStyles.optionText}>Contáctanos - Instagram</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={dynamicStyles.sectionTitle}>Sesión</Text>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={dynamicStyles.textColor} />
            <Text style={dynamicStyles.optionText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lightMode: {
    container: {
      backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
      color: '#000000',
    },
    optionButton: {
      backgroundColor: '#F7F7F7',
    },
    optionText: {
      color: '#000000',
      marginLeft: 12,
    },
    textColor: '#000000',
  },
  darkMode: {
    container: {
      backgroundColor: '#162d44',
    },
    sectionTitle: {
      color: '#FFFFFF',
    },
    optionButton: {
      backgroundColor: '#333333',
    },
    optionText: {
      color: '#FFFFFF',
      marginLeft: 12,
    },
    textColor: '#FFFFFF',
  },
});

export default SettingsScreen;
