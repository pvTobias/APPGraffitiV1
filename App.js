import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './views/Login';
import RegisterScreen from './views/Register';
import HomeScreen from './views/Home';
import EditProduct from './views/EditProduct';
import CartScreen from './views/Cart';
import ProductDetailScreen from './views/ProductDetail';
import SettingsScreen from './views/Settings';
import EditProfileScreen from './views/EditProfile';
import AdminHomeScreen from './views/AdminHome';
import AddProductScreen from './views/AddProduct';
import AdminOrderHistoryScreen from './views/AdminOrderHistory';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EditProduct" 
          component={EditProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{
            title: 'Carrito de Compras',
            headerStyle: { backgroundColor: '#2D2D2D' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AdminHome" 
          component={AdminHomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AdminOrderHistory" 
          component={AdminOrderHistoryScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddProduct" 
          component={AddProductScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
