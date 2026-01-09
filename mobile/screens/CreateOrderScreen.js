import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const CreateOrderScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [packageDesc, setPackageDesc] = useState('');
    const [pickup, setPickup] = useState('');
    const [delivery, setDelivery] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!packageDesc || !pickup || !delivery || !amount) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await client.post('/orders/create', {
                package_description: packageDesc,
                pickup_address: pickup,
                delivery_address: delivery,
                amount: parseFloat(amount)
            });
            Alert.alert('Success', 'Order created successfully');
            navigation.goBack();
        } catch (error) {
            console.log('Create order error', error);
            Alert.alert('Error', 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>New Shipment</Text>
                        <Text style={styles.headerSub}>Enter details for your delivery</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Package Description</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="E.g., Box of books, Electronics"
                                value={packageDesc}
                                onChangeText={setPackageDesc}
                            />
                        </View>

                        <View style={styles.locationsContainer}>
                            <View style={styles.timelineContainer}>
                                <View style={[styles.dot, { backgroundColor: '#4CD964' }]} />
                                <View style={styles.line} />
                                <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
                            </View>
                            
                            <View style={{ flex: 1 }}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Pickup Location</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter pickup address"
                                        value={pickup}
                                        onChangeText={setPickup}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { marginTop: 10 }]}>
                                    <Text style={styles.label}>Drop-off Location</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter delivery address"
                                        value={delivery}
                                        onChangeText={setDelivery}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Delivery Amount (₹)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={handleCreate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Create Order</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        padding: 20
    },
    header: {
        marginBottom: 30
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5
    },
    headerSub: {
        fontSize: 16,
        color: '#666'
    },
    form: {
        flex: 1
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#1a1a1a'
    },
    locationsContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    timelineContainer: {
        alignItems: 'center',
        marginRight: 15,
        paddingTop: 40 // align with first input text roughly
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    line: {
        width: 2,
        height: 80, // Approximate height to span between inputs
        backgroundColor: '#eee',
        marginVertical: 4
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    }
});

export default CreateOrderScreen;
