import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/FireBaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddProduct = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (title && description && price && image && about && category) {
      try {
        const productData = {
          name: title,
          description: description,
          price: price,
          imageUrl: image, // Image URL obtenido del picker
          about: about,
          category: category,
        };

        await addDoc(collection(db, 'Products'), productData);
        Alert.alert('Producto agregado', 'El producto se ha agregado correctamente.');
        navigation.goBack();
      } catch (error) {
        console.error('Error al agregar producto:', error);
        Alert.alert('Error', 'Hubo un problema al agregar el producto.');
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.products}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.productImage} />
            ) : (
              <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Título del Producto"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción del Producto"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Precio del Producto"
            placeholderTextColor="#888"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Acerca del Producto (About)"
            placeholderTextColor="#888"
            value={about}
            onChangeText={setAbout}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Categoría del Producto"
            placeholderTextColor="#888"
            value={category}
            onChangeText={setCategory}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>Agregar Producto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: '#2D2D2D',
  },
  iconButton: {
    backgroundColor: '#E6E6E6',
    padding: 10,
    borderRadius: 10,
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
  },
  imagePicker: {
    backgroundColor: '#3C3C3C',
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  imagePickerText: {
    color: '#aaa',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#3C3C3C',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#8B6A60',
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddProduct;
