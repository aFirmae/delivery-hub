import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import client from '../api/client';
import { AuthContext } from '../contexts/AuthContext';

const DailyEarningsScreen = ({ navigation }) => {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEarnings = async () => {
        try {
            const response = await client.get('/orders/partner/earnings');
            setEarnings(response.data);
        } catch (error) {
            console.log('Error fetching earnings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.dateContainer}>
                 <Feather name="calendar" size={18} color="#666" style={{marginRight: 8}} />
                <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
            </View>
            <Text style={styles.amount}>${parseFloat(item.total).toFixed(2)}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Earnings</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <View style={styles.content}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Earnings</Text>
                        <Text style={styles.summaryAmount}>${parseFloat(earnings?.total || 0).toFixed(2)}</Text>
                    </View>

                    <Text style={styles.listTitle}>History</Text>
                    <FlatList
                        data={earnings?.daily || []}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.date}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No earnings yet.</Text>
                            </View>
                        }
                    />
                </View>
            )}
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
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    backButton: {
        marginRight: 15
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        padding: 20
    },
    summaryCard: {
        backgroundColor: '#007AFF',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '500'
    },
    summaryAmount: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold'
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 15
    },
    list: {
        paddingBottom: 20
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee'
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    date: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745'
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center'
    },
    emptyText: {
        color: '#666',
        fontSize: 16
    }
});

export default DailyEarningsScreen;
