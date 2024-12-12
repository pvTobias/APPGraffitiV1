import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../config/FireBaseConfig';
import { getAuth } from 'firebase/auth'; 
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = ({ route, navigation }) => {
  const { productId } = route.params; 
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); 
  const maxQuantity = 10;
  const auth = getAuth(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'Products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data()); 
        } else {
          Alert.alert('Error', 'Producto no encontrado');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        Alert.alert('Error', 'Hubo un problema al obtener los detalles del producto');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const getDarkModePreference = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkModeEnabled(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.error('Error al recuperar el modo oscuro/claro: ', error);
      }
    };

    getDarkModePreference();
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      const user = auth.currentUser; 
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para agregar productos al carrito.');
        setIsLoading(false);
        return;
      }

      const uid = user.uid; 
      const cartRef = doc(db, 'cart', uid); 
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const existingCart = cartSnap.data().items || [];
        const newCart = [...existingCart, { productId, quantity: selectedQuantity }];
        await setDoc(cartRef, { items: newCart });
      } else {
        await setDoc(cartRef, { items: [{ productId, quantity: selectedQuantity }] });
      }

      Alert.alert('Éxito', 'Producto agregado al carrito exitosamente.');
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Alert.alert('Error', 'Hubo un problema al agregar el producto al carrito.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Cargando detalles del producto..." />;
  }

  if (!product) {
    return null;
  }

  return (
    <View style={[styles.container, darkModeEnabled ? styles.darkContainer : styles.lightContainer]}>
      <Image
        source={{ uri: product.imageUrl }} 
        style={styles.productImage}
      />
      <View style={styles.backAndCartContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={[styles.detailsContainer, darkModeEnabled ? styles.darkDetailsContainer : styles.lightDetailsContainer]}>
        <Text style={[styles.productName, darkModeEnabled ? styles.darkText : styles.lightText]}>{product.name}</Text>
        <Text style={[styles.productDescription, darkModeEnabled ? styles.darkText : styles.lightText]}>{product.description}</Text>
        <Text style={[styles.sectionTitle, darkModeEnabled ? styles.darkText : styles.lightText]}>Cantidad</Text>
        <View style={styles.quantityContainer}>
          {[...Array(maxQuantity)].map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quantityButton,
                selectedQuantity === index + 1 ? styles.selectedQuantity : styles.unselectedQuantity
              ]}
              onPress={() => setSelectedQuantity(index + 1)}
            >
              <Text style={styles.quantityText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>${product.price}</Text>
        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#162d44',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  backAndCartContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 10,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    marginTop: -40,
    width: '100%',
    alignItems: 'center',
  },
  darkDetailsContainer: {
    backgroundColor: '#333333',
  },
  lightDetailsContainer: {
    backgroundColor: '#FFFFFF',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#B6A99A',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  selectedQuantity: {
    backgroundColor: '#5ccb2c',
  },
  unselectedQuantity: {
    backgroundColor: '#FFFFFF',
  },
  quantityText: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#5ccb2c',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
});

export default ProductDetail;
