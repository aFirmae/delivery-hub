import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import client from '../api/client';

const CreateOrderScreen = ({ navigation }) => {
	const [description, setDescription] = useState('');
	const [pickup, setPickup] = useState('');
	const [delivery, setDelivery] = useState('');
	const [amount, setAmount] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!description || !pickup || !delivery || !amount) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		setLoading(true);
		try {
			await client.post('/orders/create', {
				package_description: description,
				pickup_address: pickup,
				delivery_address: delivery,
				amount: parseFloat(amount)
			});
			Alert.alert('Success', 'Order created successfully');
			navigation.goBack();
		} catch (error) {
			Alert.alert('Error', 'Failed to create order');
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.label}>Package Description</Text>
			<TextInput
				style={styles.input}
				value={description}
				onChangeText={setDescription}
				multiline
			/>

			<Text style={styles.label}>Pickup Address</Text>
			<TextInput
				style={styles.input}
				value={pickup}
				onChangeText={setPickup}
				multiline
			/>

			<Text style={styles.label}>Delivery Address</Text>
			<TextInput
				style={styles.input}
				value={delivery}
				onChangeText={setDelivery}
				multiline
			/>

			<Text style={styles.label}>Amount (₹)</Text>
			<TextInput
				style={styles.input}
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
			/>

			<Button title={loading ? "Creating..." : "Create Order"} onPress={handleSubmit} disabled={loading} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: '#fff',
		flexGrow: 1
	},
	label: {
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
		padding: 10,
		fontSize: 16,
		backgroundColor: '#fafafa'
	},
});

export default CreateOrderScreen;
