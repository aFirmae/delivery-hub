import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderDetailsScreen = ({ route, navigation }) => {
    const { orderId } = route.params;
    const { userInfo } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const response = await client.get(`/orders/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            console.log('Error fetching order details', error);
            Alert.alert("Error", "Could not fetch order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const handleCancelOrder = async () => {
        Alert.alert(
            "Cancel Order",
            "Are you sure you want to cancel this order?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await client.put(`/orders/${orderId}/cancel`);
                            Alert.alert("Success", "Order cancelled successfully");
                            navigation.goBack();
                        } catch (error) {
                            console.log('Error cancelling order', error);
                            Alert.alert("Error", error.response?.data?.message || "Failed to cancel order");
                        }
                    }
                }
            ]
        );
    };
    
    // Function to handle status update for Delivery Partners
    const updateStatus = async (newStatus) => {
        try {
            await client.put(`/orders/${orderId}/status`, {
                status: newStatus,
                delivery_partner_id: userInfo.id 
            });
            Alert.alert("Success", `Order ${newStatus}`);
            fetchOrderDetails();
        } catch (error) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    const getActionButtons = () => {
        if (userInfo.user_type === 'delivery_partner') {
            if (order.status === 'pending') {
                return (
                    <TouchableOpacity style={styles.actionButton} onPress={() => updateStatus('assigned')}>
                        <Text style={styles.actionButtonText}>Accept Order</Text>
                    </TouchableOpacity>
                );
            }
            if (order.status === 'assigned') {
                return (
                    <TouchableOpacity style={styles.actionButton} onPress={() => updateStatus('in_transit')}>
                        <Text style={styles.actionButtonText}>Start Delivery</Text>
                    </TouchableOpacity>
                );
            }
            if (order.status === 'in_transit') {
                return (
                    <TouchableOpacity style={styles.actionButton} onPress={() => updateStatus('delivered')}>
                        <Text style={styles.actionButtonText}>Mark Delivered</Text>
                    </TouchableOpacity>
                );
            }
        }
        return null;
    };

    if (loading) {
        return <View style={styles.loading}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    if (!order) {
        return <View style={styles.center}><Text>Order not found</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order #{order.id}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Status Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Status</Text>
                    <View style={[styles.statusBadge, styles[`statusBadge_${order.status}`]]}>
                        <Text style={[styles.statusText, styles[`statusText_${order.status}`]]}>
                            {order.status.replace('_', ' ').toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.date}>Placed on {new Date(order.created_at).toLocaleString()}</Text>
                </View>

                {/* Package Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Package Details</Text>
                    <Text style={styles.description}>{order.package_description}</Text>
                    <View style={styles.divider}/>
                    <View style={styles.row}>
                        <Text style={styles.label}>Amount</Text>
                        <Text style={styles.amount}>₹{order.amount}</Text>
                    </View>
                </View>

                {/* Location Details */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Locations</Text>
                    
                    <View style={styles.locationRow}>
                         <View style={[styles.dot, { backgroundColor: '#4CD964' }]} />
                         <View style={styles.locationTextContainer}>
                             <Text style={styles.locationLabel}>Pickup</Text>
                             <Text style={styles.address}>{order.pickup_address}</Text>
                         </View>
                    </View>

                    <View style={styles.line} />

                    <View style={styles.locationRow}>
                         <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
                         <View style={styles.locationTextContainer}>
                             <Text style={styles.locationLabel}>Drop-off</Text>
                             <Text style={styles.address}>{order.delivery_address}</Text>
                         </View>
                    </View>
                </View>

                {/* Actions */}
                {userInfo.user_type === 'sender' && order.status === 'pending' && (
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                )}
                
                {/* Delivery Partner Actions */}
                 <View style={styles.actions}>
                    {getActionButtons()}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    content: {
        padding: 20,
        paddingBottom: 40
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1a1a1a'
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10
    },
    statusBadge_pending: { backgroundColor: '#FFF4E5' },
    statusBadge_assigned: { backgroundColor: '#E5F7FF' },
    statusBadge_in_transit: { backgroundColor: '#E5F0FF' },
    statusBadge_delivered: { backgroundColor: '#E5FFE9' },
    statusBadge_cancelled: { backgroundColor: '#FFE5E5' },
    
    statusText: { fontWeight: 'bold', fontSize: 14 },
    statusText_pending: { color: '#FF9500' },
    statusText_assigned: { color: '#5AC8FA' },
    statusText_in_transit: { color: '#007AFF' },
    statusText_delivered: { color: '#4CD964' },
    statusText_cancelled: { color: '#FF3B30' },

    date: {
        color: '#888',
        fontSize: 12
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        color: '#666'
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 5,
        marginRight: 15
    },
    line: {
        width: 2,
        height: 30,
        backgroundColor: '#eee',
        marginLeft: 5,
        marginVertical: 4
    },
    locationTextContainer: {
        flex: 1
    },
    locationLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4
    },
    address: {
        fontSize: 15,
        color: '#1a1a1a',
        lineHeight: 20
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FF3B30',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        fontSize: 16
    },
    actions: {
        marginTop: 10
    },
    actionButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default OrderDetailsScreen;
