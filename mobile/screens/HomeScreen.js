import React, { useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, StatusBar, ImageBackground } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import client from '../api/client';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'; // Assuming Expo environment

const HomeScreen = ({ navigation }) => {
	const { userInfo } = useContext(AuthContext);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchOrders = async () => {
		setLoading(true);
		try {
            // Fetch only active orders
			const response = await client.get('/orders?type=active');
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
            activeOpacity={0.9}
		>
            <View style={styles.cardIndicator(item.status)} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={styles.orderIdBadge}>
                         <Text style={styles.orderIdText}>#{item.id}</Text>
                    </View>
                    <View style={[styles.statusBadge, styles[`statusBadge_${item.status}`]]}>
                        <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
                    </View>
                </View>
                
                <View style={styles.divider} />

                <Text style={styles.desc} numberOfLines={2}>{item.package_description}</Text>
                
                <View style={styles.cardFooter}>
                    <View style={styles.locationContainer}>
                        <Feather name="map-pin" size={12} color="#888" />
                        <Text style={styles.locationText} numberOfLines={1}> {item.delivery_address}</Text>
                    </View>
                    <Text style={styles.amount}>₹{item.amount}</Text>
                </View>
            </View>
		</TouchableOpacity>
	);

    const GreetingHeader = () => (
        <View style={styles.headerContainer}>
            <View>
                <Text style={styles.greetingSub}>Welcome back,</Text>
                <Text style={styles.greetingMain}>{userInfo?.name?.split(' ')[0]}</Text>
            </View>
            <TouchableOpacity style={styles.avatar}>
               <Text style={styles.avatarText}>{userInfo?.name?.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    );

	return (
		<SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
			<GreetingHeader />

            <View style={styles.sectionHeader}>
                 <Text style={styles.sectionTitle}>Active Deliveries</Text>
                 <TouchableOpacity onPress={() => fetchOrders()}>
                      <Feather name="refresh-ccw" size={18} color="#007AFF" />
                 </TouchableOpacity>
            </View>

			<FlatList
				data={orders}
				keyExtractor={item => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} tintColor="#007AFF" />}
				ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Feather name="package" size={50} color="#ddd" />
                        <Text style={styles.emptyText}>No active orders</Text>
                         {userInfo?.user_type === 'sender' && (
                            <Text style={styles.emptySubText}>Tap + to start sending packages</Text>
                         )}
                    </View>
                }
			/>

			{userInfo?.user_type === 'sender' && (
				<TouchableOpacity
					style={styles.fab}
					onPress={() => navigation.navigate('CreateOrder')}
                    activeOpacity={0.8}
				>
					<Feather name="plus" size={30} color="#fff" />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    greetingSub: {
        fontSize: 14,
        color: '#666',
    },
    greetingMain: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
	list: {
		paddingHorizontal: 20,
        paddingBottom: 80
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 16,
		marginBottom: 16,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 10,
        flexDirection: 'row',
        overflow: 'hidden'
	},
    cardIndicator: (status) => ({
        width: 6,
        backgroundColor: 
            status === 'pending' ? '#FF9500' :
            status === 'assigned' ? '#5AC8FA' :
            status === 'in_transit' ? '#007AFF' :
            '#4CD964'
    }),
    cardContent: {
        flex: 1,
        padding: 16,
    },
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
        alignItems: 'center',
		marginBottom: 12
	},
    orderIdBadge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    orderIdText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#555'
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadge_pending: { backgroundColor: '#FFF4E5' },
    statusBadge_assigned: { backgroundColor: '#E5F7FF' },
    statusBadge_in_transit: { backgroundColor: '#E5F0FF' },
    statusBadge_delivered: { backgroundColor: '#E5FFE9' },
    
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333'
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 10
    },
	desc: {
		color: '#444',
		marginBottom: 15,
        fontSize: 15,
        lineHeight: 22
	},
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    locationText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
        flex: 1
    },
	amount: {
		fontWeight: '800',
		fontSize: 16,
        color: '#1a1a1a'
	},
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 18,
        color: '#999',
        fontWeight: '500'
    },
    emptySubText: {
        fontSize: 14,
        color: '#bbb',
        marginTop: 5
    },
	fab: {
		position: 'absolute',
		right: 20,
		bottom: 25,
		backgroundColor: '#1a1a1a', // Dark theme fab
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
	},
});

export default HomeScreen;
