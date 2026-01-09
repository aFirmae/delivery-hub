import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, ScrollView } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../contexts/AuthContext';

const OrderDetailsScreen = ({ route, navigation }) => {
    const { orderId } = route.params;
    const { userInfo } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const response = await client.get(`/orders/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch order details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const updateStatus = async (newStatus) => {
        try {
            await client.put(`/orders/${orderId}/status`, {
                status: newStatus,
                delivery_partner_id: userInfo.id // If updating to assigned, take ownership
            });
            Alert.alert("Success", `Order ${newStatus}`);
            fetchOrder();
        } catch (error) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.center} />;
    if (!order) return null;

    const getActionButtons = () => {
        if (userInfo.user_type === 'delivery_partner') {
            if (order.status === 'pending') {
                return <Button title="Accept Order" onPress={() => updateStatus('assigned')} />;
            }
            if (order.status === 'assigned') {
                return <Button title="Start Delivery" onPress={() => updateStatus('in_transit')} />;
            }
            if (order.status === 'in_transit') {
                return <Button title="Mark Delivered" onPress={() => updateStatus('delivered')} />;
            }
        }
        return null;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Order #{order.id}</Text>
            <Text style={styles.status}>Status: <Text style={{ fontWeight: 'bold' }}>{order.status.toUpperCase()}</Text></Text>

            <View style={styles.section}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.text}>{order.package_description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Pickup</Text>
                <Text style={styles.text}>{order.pickup_address}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Delivery</Text>
                <Text style={styles.text}>{order.delivery_address}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.text}>₹{order.amount}</Text>
            </View>

            <View style={styles.actions}>
                {getActionButtons()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    status: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555'
    },
    section: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5
    },
    text: {
        fontSize: 16,
        color: '#000'
    },
    actions: {
        marginTop: 20
    }
});

export default OrderDetailsScreen;
