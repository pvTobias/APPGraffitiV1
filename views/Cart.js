import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/FireBaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

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

  useEffect(() => {
    // Fetching cart items with proper checks
const fetchCartItems = async () => {
  if (!user) {
    Alert.alert('Error', 'El usuario no está autenticado.');
    return;
  }

  setIsLoading(true);
  try {
    const cartRef = doc(db, 'cart', user.uid);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data().items || [];
      const fetchedItems = await Promise.all(
        cartData.map(async (cartItem) => {
          const productRef = doc(db, 'Products', cartItem.productId);
          const productSnap = await getDoc(productRef);
          return productSnap.exists() ? { ...productSnap.data(), quantity: cartItem.quantity } : null;
        })
      );

      const validItems = fetchedItems.filter(item => item !== null);
      setItems(validItems);
      const total = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(total);
    } else {
      setItems([]);
      setTotalPrice(0);
    }
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
    Alert.alert('Error', 'Hubo un problema al obtener los productos del carrito.');
  } finally {
    setIsLoading(false);
  }
};


    fetchCartItems();
  }, [user]);

  const handleDelete = async (index) => {
    if (!user) {
      Alert.alert('Error', 'El usuario no está autenticado.');
      return;
    }

    setIsLoading(true);
    try {
      const cartRef = doc(db, 'cart', user.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const currentCart = cartSnap.data().items || [];
        currentCart.splice(index, 1); // Eliminar producto
        await setDoc(cartRef, { items: currentCart });
        setItems(currentCart);

        const updatedItems = currentCart.map(async (cartItem) => {
          const productRef = doc(db, 'Products', cartItem.productId);
          const productSnap = await getDoc(productRef);
          return { ...productSnap.data(), quantity: cartItem.quantity };
        });
        const newTotal = (await Promise.all(updatedItems)).reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(newTotal);
      }
      Alert.alert('Éxito', 'Producto eliminado exitosamente.');
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      Alert.alert('Error', 'Problema al eliminar el producto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    const phoneNumber = '+5492944617762'; 
    const orderSummary = items.map(item => `Producto: ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${item.price * item.quantity}`).join('\n');
    const message = `Hola, me gustaría realizar el siguiente pedido:\n\n${orderSummary}\n\nPrecio Total: $${totalPrice}`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp.');
    });
  };

  return (
    <View style={[styles.container, darkModeEnabled ? styles.darkContainer : styles.lightContainer]}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#8B6A60" />
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.cartItem, darkModeEnabled ? styles.darkCartItem : styles.lightCartItem]}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={[styles.productName, darkModeEnabled ? styles.darkText : styles.lightText]}>{item.name}</Text>
                <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>Cantidad: {item.quantity}</Text>
                <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>Precio Unitario: ${item.price}</Text>
                <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>Subtotal: ${item.price * item.quantity}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <View style={[styles.fixedButtonContainer, darkModeEnabled ? styles.darkFixedButtonContainer : styles.lightFixedButtonContainer]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalText, darkModeEnabled ? styles.darkText : styles.lightText]}>Precio Total:</Text>
          <Text style={[styles.totalPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>${totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.purchaseButton} onPress={handleCheckout}>
          <Text style={styles.purchaseButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkContainer: { backgroundColor: '#162d44' },
  lightContainer: { backgroundColor: '#f5f5f5' },
  scrollViewContent: { paddingHorizontal: 20, paddingBottom: 120 },
  cartItem: { flexDirection: 'row', borderRadius: 10, padding: 10, marginBottom: 15, alignItems: 'center' },
  darkCartItem: { backgroundColor: '#3C3C3C' },
  lightCartItem: { backgroundColor: '#fff' },
  productImage: { width: 100, height: 100, borderRadius: 10 },
  productDetails: { flex: 1, marginLeft: 10 },
  productName: { fontWeight: 'bold' },
  productPrice: { marginTop: 5 },
  darkText: { color: '#fff' },
  lightText: { color: '#333' },
  deleteButton: { backgroundColor: '#df1919', padding: 10, borderRadius: 5, marginTop: 10 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  fixedButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1 },
  darkFixedButtonContainer: { backgroundColor: '#162d44', borderTopColor: '#555' },
  lightFixedButtonContainer: { backgroundColor: '#fff', borderTopColor: '#ddd' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalText: { fontWeight: 'bold' },
  totalPrice: { fontWeight: 'bold' },
  purchaseButton: { backgroundColor: '#5ccb2c', padding: 15, borderRadius: 5, alignItems: 'center' },
  purchaseButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default Cart;
