import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const orderHistory = [
  { id: '1', customerName: 'Tobias', totalAmount: '$13000', date: '2024-10-13', status: 'Completado' },
];

const AdminOrderHistory = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Cliente: {item.customerName}</Text>
      <Text style={styles.orderText}>Total: {item.totalAmount}</Text>
      <Text style={styles.orderText}>Fecha: {item.date}</Text>
      <Text style={styles.orderText}>Estado: {item.status}</Text>
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      <FlatList
        data={orderHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2D2D2D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#3C3C3C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  orderText: {
    color: '#fff',
    marginBottom: 5,
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#8B6A60',
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminOrderHistory;
