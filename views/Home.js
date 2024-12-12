import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from './LoadingScreen'; 

const Home = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Libreria'); 
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); 
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Categorias'));
      const categories = [];
      snapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      console.log('Categorías obtenidas:', categories);
      setCategoryList(categories);
    } catch (error) {
      console.error('Error al obtener categorías: ', error);
    }
  };

  // Función para cargar sliders de una categoría específica
  const GetSliders = async (category) => {
    const q = query(collection(db, 'Products'), where('category', '==', category)); 
    const snapshot = await getDocs(q);
    const sliders = [];
    snapshot.forEach((doc) => {
      sliders.push({ ...doc.data(), id: doc.id });
    });
    console.log('Productos cargados:', sliders); 
    setSliderList(sliders);
    setLoading(false); 
  };

  // Cargar sliders según la categoría seleccionada
  useEffect(() => {
    GetSliders(selectedTab);
  }, [selectedTab]);

  // Recuperar el estado del modo oscuro desde AsyncStorage cada vez que la pantalla sea enfocada
  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  // Renderizar el contenido de los productos
  const renderContent = () => {
    if (loading) {
      return <LoadingScreen message="Cargando productos..." />; // Mostrar LoadingScreen
    }
    return (
      <View style={styles.products}>
        {sliderList.map((item, index) => (
          <View key={index} style={[styles.productCard, darkModeEnabled ? styles.darkProductCard : styles.lightProductCard]}>
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl }}
            />
            <Text style={[styles.productName, darkModeEnabled ? styles.darkText : styles.lightText]}>{item.name}</Text>
            <Text style={[styles.productDesc, darkModeEnabled ? styles.darkText : styles.lightText]}>{item.description}</Text>
            <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>${item.price}</Text>
            <TouchableOpacity
              style={[styles.cartButton, darkModeEnabled ? styles.darkCartButton : styles.lightCartButton]}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <Text style={darkModeEnabled ? styles.darkCartText : styles.lightCartText}>🛒</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, darkModeEnabled ? styles.darkContainer : styles.lightContainer]}>
      <View style={[styles.header, darkModeEnabled ? styles.darkHeader : styles.lightHeader]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={[styles.iconButton, !darkModeEnabled && styles.lightIconButton]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={darkModeEnabled ? "black" : "black"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, !darkModeEnabled && styles.lightIconButton]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={darkModeEnabled ? "black" : "black"} />
          </TouchableOpacity>
        </View>
        <Image style={styles.headerImage} source={require('../assets/banner.jpeg')} />
      </View>

      {/* Renderizado del menú dinámico */}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#162d44',
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
    backgroundColor: '#5ccb2c',
  },
  lightCategoryButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#2D2C2B',
    borderWidth: 1,
    borderColor: '#5ccb2c',
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
    color: '#333',
  },
  productDesc: {
    marginTop: 5,
  },
  productPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  cartButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  darkCartButton: {
    backgroundColor: '#5ccb2c',
  },
  lightCartButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  darkCartText: {
    color: '#fff',
  },
  lightCartText: {
    color: '#333',
  },
});

export default Home;
