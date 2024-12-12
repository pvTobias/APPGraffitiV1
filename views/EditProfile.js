import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import LoadingScreen from './LoadingScreen';
import { getApp } from 'firebase/app'; // Import getApp to access the initialized app

const EditProfile = () => {
  // Initialize Firebase Auth with AsyncStorage for persistence
  const app = getApp(); // Get the initialized Firebase app
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || '');
          setPhone(userData.phone || '');
        }
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
        Alert.alert('Error', 'No se pudo cargar la información del perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { displayName, email, phone }, { merge: true });

      Alert.alert('Éxito', 'Perfil actualizado exitosamente');
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Nombre de usuario"
      />
      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false} // El correo no es editable
      />
      <Text style={styles.label}>Teléfono:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Número de teléfono"
        keyboardType="phone-pad"
      />
      <Button title="Guardar Cambios" onPress={handleSave} color="#8B6A60" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { height: 40, borderColor: '#5ccb2c', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});

export default EditProfile;
