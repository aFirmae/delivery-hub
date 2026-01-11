import React, { useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import client from '../api/client';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Fetch history from API (status = delivered/cancelled)
            const response = await client.get('/orders?type=history');
            setOrders(response.data.orders);
        } catch (error) {
            console.log('Error fetching history', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id, displayId: index + 1 })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order #{index + 1}</Text>
                <Text style={[styles.status, styles[`status_${item.status}`]]}>{item.status.replace('_', ' ').toUpperCase()}</Text>
            </View>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <Text style={styles.desc} numberOfLines={1}>{item.package_description}</Text>
             <View style={styles.footer}>
                 <Text style={styles.amount}>₹{item.amount}</Text>
             </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>Order History</Text>
            </View>
            <FlatList
                data={orders}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHistory} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>No past orders found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    list: {
        padding: 15
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#ddd' // Default border color
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    orderId: {
        fontWeight: '700',
        fontSize: 16,
        color: '#333'
    },
    status: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        overflow: 'hidden',
        color: 'white',
        backgroundColor: 'gray'
    },
    status_delivered: { backgroundColor: '#4CD964' },
    status_cancelled: { backgroundColor: '#FF3B30' },
    date: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8
    },
    desc: {
        color: '#555',
        marginBottom: 10,
        fontSize: 14
    },
    footer: {
         flexDirection: 'row',
         justifyContent: 'flex-end',
         marginTop: 5,
         paddingTop: 5,
         borderTopWidth: 1,
         borderTopColor: '#f5f5f5'
    },
    amount: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1a1a1a'
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center'
    },
    empty: {
        fontSize: 16,
        color: '#888'
    }
});

export default HistoryScreen;
