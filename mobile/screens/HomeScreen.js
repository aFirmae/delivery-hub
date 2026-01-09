import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import client from '../api/client';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
	const { userInfo, logout } = useContext(AuthContext);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await client.get('/orders');
			setOrders(response.data.orders);
		} catch (error) {
			console.log('Error fetching orders', error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchOrders();
		}, [])
	);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
		>
			<View style={styles.cardHeader}>
				<Text style={styles.orderId}>Order #{item.id}</Text>
				<Text style={[styles.status, styles[`status_${item.status}`]]}>{item.status.toUpperCase()}</Text>
			</View>
			<Text style={styles.desc} numberOfLines={1}>{item.package_description}</Text>
			<Text style={styles.amount}>₹{item.amount}</Text>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Welcome, {userInfo?.name}</Text>
				<TouchableOpacity onPress={logout}>
					<Text style={styles.logout}>Logout</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={orders}
				keyExtractor={item => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
				ListEmptyComponent={<Text style={styles.empty}>No orders found</Text>}
			/>

			{userInfo?.user_type === 'sender' && (
				<TouchableOpacity
					style={styles.fab}
					onPress={() => navigation.navigate('CreateOrder')}
				>
					<Text style={styles.fabIcon}>+</Text>
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	logout: {
		color: 'red'
	},
	list: {
		padding: 15
	},
	card: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5
	},
	orderId: {
		fontWeight: 'bold',
		fontSize: 16
	},
	status: {
		fontSize: 12,
		fontWeight: 'bold',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
		overflow: 'hidden',
		color: 'white',
		backgroundColor: 'gray'
	},
	status_pending: { backgroundColor: '#FF9500' },
	status_assigned: { backgroundColor: '#5AC8FA' },
	status_in_transit: { backgroundColor: '#007AFF' },
	status_delivered: { backgroundColor: '#4CD964' },
	status_cancelled: { backgroundColor: '#FF3B30' },
	desc: {
		color: '#555',
		marginBottom: 5
	},
	amount: {
		fontWeight: 'bold',
		marginTop: 5
	},
	fab: {
		position: 'absolute',
		right: 20,
		bottom: 20,
		backgroundColor: '#007AFF',
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 5
	},
	fabIcon: {
		color: 'white',
		fontSize: 30,
		marginTop: -2
	},
	empty: {
		textAlign: 'center',
		marginTop: 50,
		color: '#888'
	}
});

export default HomeScreen;
