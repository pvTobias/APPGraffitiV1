import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Libreria');
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // Cargar categorías y sliders
  useEffect(() => {
    GetCategories();
  }, []);

  useEffect(() => {
    GetSliders(selectedTab);
  }, [selectedTab]);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Categorias'));
    const categories = snapshot.docs.map(doc => doc.data());
    setCategoryList(categories);
  };

  const GetSliders = async (category) => {
    const q = query(collection(db, 'Products'), where('category', '==', category));
    const snapshot = await getDocs(q);
    const sliders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setSliderList(sliders);
  };

  // Recuperar el estado del modo oscuro
  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  const handleEditProduct = (productId) => {
    navigation.navigate('EditProduct', { productId });
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await deleteDoc(doc(db, 'Products', productId));
            GetSliders(selectedTab); // Refrescar la lista de productos después de eliminar
          }
        }
      ]
    );
  };

  const renderContent = () => (
    <View style={styles.products}>
      {sliderList.map((item, index) => (
        <View key={index} style={[styles.productCard, darkModeEnabled ? styles.darkProductCard : styles.lightProductCard]}>
          <Image style={styles.productImage} source={{ uri: item.imageUrl }} />
          <Text style={[styles.productName, darkModeEnabled ? styles.darkText : styles.lightText]}>{item.name}</Text>
          <Text style={[styles.productDesc, darkModeEnabled ? styles.darkText : styles.lightText]}>{item.description}</Text>
          <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>${item.price}</Text>
          <TouchableOpacity
            style={[styles.cartButton, darkModeEnabled ? styles.darkCartButton : styles.lightCartButton]}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <Text style={darkModeEnabled ? styles.darkCartText : styles.lightCartText}>🛒</Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.editButton, darkModeEnabled ? styles.darkEditButton : styles.lightEditButton]}
              onPress={() => handleEditProduct(item.id)}
            >
              <Text style={darkModeEnabled ? styles.darkEditText : styles.lightEditText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, darkModeEnabled ? styles.darkDeleteButton : styles.lightDeleteButton]}
              onPress={() => handleDeleteProduct(item.id)}
            >
              <Text style={darkModeEnabled ? styles.darkDeleteText : styles.lightDeleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={[styles.container, darkModeEnabled ? styles.darkContainer : styles.lightContainer]}>
      <View style={[styles.header, darkModeEnabled ? styles.darkHeader : styles.lightHeader]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={[styles.iconButton, !darkModeEnabled && styles.lightIconButton]} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={darkModeEnabled ? "black" : "black"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, !darkModeEnabled && styles.lightIconButton]} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={24} color={darkModeEnabled ? "black" : "black"} />
          </TouchableOpacity>
        </View>
        <Image style={styles.headerImage} source={require('../assets/banner.jpeg')} />
      </View>

      {/* Renderizar el menú dinámico */}
      <View style={styles.menu}>
        {categoryList.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuButton, selectedTab === category.name && styles.activeButton, darkModeEnabled ? styles.darkCategoryButton : styles.lightCategoryButton]}
            onPress={() => setSelectedTab(category.name)}
          >
            <Text style={darkModeEnabled ? styles.darkText : styles.lightText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}

      {/* Botón para agregar nuevo producto */}
      <TouchableOpacity
        style={[styles.addButton, darkModeEnabled ? styles.darkAddButton : styles.lightAddButton]}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={darkModeEnabled ? styles.darkAddText : styles.lightAddText}>Agregar Producto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#2D2D2D',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  header: {
    height: 240,
    position: 'relative',
  },
  darkHeader: {
    backgroundColor: '#333',
  },
  lightHeader: {
    backgroundColor: '#f5f5f5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 50,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: '#E6E6E6',
    padding: 10,
    borderRadius: 10,
  },
  lightIconButton: {
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  darkCategoryButton: {
    backgroundColor: '#8B6A60',
  },
  lightCategoryButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#2D2C2B',
    borderWidth: 1,
    borderColor: '#8B6A60',
  },
  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    width: '45%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  darkProductCard: {
    backgroundColor: '#3C3C3C',
  },
  lightProductCard: {
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  productDesc: {
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    marginVertical: 5,
  },
  cartButton: {
    backgroundColor: '#B0C4DE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkCartButton: {
    backgroundColor: '#6495ED',
  },
  lightCartButton: {
    backgroundColor: '#ADD8E6',
  },
  darkCartText: {
    color: '#fff',
  },
  lightCartText: {
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
  },
  darkEditButton: {
    backgroundColor: '#FFA500',
  },
  lightEditButton: {
    backgroundColor: '#FFD700',
  },
  darkEditText: {
    color: '#fff',
  },
  lightEditText: {
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  darkDeleteButton: {
    backgroundColor: '#FF4500',
  },
  lightDeleteButton: {
    backgroundColor: '#FF6347',
  },
  darkDeleteText: {
    color: '#fff',
  },
  lightDeleteText: {
    color: '#000',
  },
  addButton: {
    backgroundColor: '#8FBC8F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  darkAddButton: {
    backgroundColor: '#006400',
  },
  lightAddButton: {
    backgroundColor: '#98FB98',
  },
  darkAddText: {
    color: '#fff',
  },
  lightAddText: {
    color: '#000',
  },
});

export default Home;
