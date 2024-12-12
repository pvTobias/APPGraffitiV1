import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/FireBaseConfig'; // Asegúrate de que auth esté correctamente configurado

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga

  // Definir el correo del administrador
  const adminEmail = "tobiasperez206@gmail.com";

  const handleLogin = () => {
    setLoading(true); // Iniciar carga

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso:", user);

        // Verifica si el email del usuario es el del administrador
        if (email === adminEmail) {
          console.log("Redirigiendo a AdminHome.js");
          navigation.navigate('AdminHome'); // Redirige a la pantalla de administrador
        } else {
          console.log("Redirigiendo a Home.js");
          navigation.navigate('Home'); // Redirige a la pantalla de usuario normal
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        setLoading(false); // Detener carga
        let errorMessage = '';

        switch (error.code) {
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Usuario no encontrado.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El correo electrónico no es válido.';
            break;
          default:
            errorMessage = 'Error desconocido. Intenta nuevamente.';
            break;
        }

        Alert.alert('Error de inicio de sesión', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Inicio de sesión</Text>
      <Text style={styles.subtitle}>
        Inicia sesión con tu cuenta de.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        placeholderTextColor="#B6A99A"
        keyboardType="email-address"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduce tu contraseña"
        placeholderTextColor="#B6A99A"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#8E5B41" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Inicia Sesión</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162d44',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#5ccb2c',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#FFFFFF',
    backgroundColor: '#333333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#162d44',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  registerLink: {
    color: '#5ccb2c',
    fontWeight: 'bold',
  },
});
