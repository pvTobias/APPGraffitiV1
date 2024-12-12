import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';

const EditProduct = ({ route, navigation }) => {
  const { productId } = route.params; // Obtener el ID del producto desde los parámetros
  const [product, setProduct] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, 'Products', productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProduct(productSnap.data());
      } else {
        Alert.alert("Error", "Producto no encontrado");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdate = async () => {
    const productRef = doc(db, 'Products', productId);
    await updateDoc(productRef, product);
    Alert.alert("Éxito", "Producto actualizado");
    navigation.goBack(); // Regresar a la pantalla anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={product.name}
        onChangeText={text => setProduct({ ...product, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={product.description}
        onChangeText={text => setProduct({ ...product, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={product.price}
        onChangeText={text => setProduct({ ...product, price: text })}
      />
      <Button title="Actualizar Producto" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
});

export default EditProduct;
