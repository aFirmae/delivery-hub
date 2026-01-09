import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [userType, setUserType] = useState('sender');
	const { register, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        if(!name || !email || !password || !phone) {
             Alert.alert('Error', 'Please fill in all fields');
             return;
        }
        await register(name, email, phone, password, userType);
    };

	return (
		<SafeAreaView style={styles.container}>
             <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.headerContainer}>
                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Feather name="arrow-left" size={24} color="#333" />
                         </TouchableOpacity>
                         <Text style={styles.headerTitle}>Create Account</Text>
                         <Text style={styles.headerSub}>Start sending or delivering today.</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                             <Feather name="user" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                             <Feather name="mail" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                             <Feather name="phone" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                             <Feather name="lock" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Text style={styles.label}>I want to be a:</Text>
                        <View style={styles.typeContainer}>
                            <TouchableOpacity 
                                style={[styles.typeButton, userType === 'sender' && styles.activeType]}
                                onPress={() => setUserType('sender')}
                            >
                                <Feather name="package" size={20} color={userType === 'sender' ? 'white' : '#666'} />
                                <Text style={[styles.typeText, userType === 'sender' && styles.activeTypeText]}>Sender</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.typeButton, userType === 'delivery_partner' && styles.activeType]}
                                onPress={() => setUserType('delivery_partner')}
                            >
                                <Feather name="truck" size={20} color={userType === 'delivery_partner' ? 'white' : '#666'} />
                                <Text style={[styles.typeText, userType === 'delivery_partner' && styles.activeTypeText]}>Partner</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                         <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.link}>Login</Text>
                            </TouchableOpacity>
                        </View>
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
        padding: 20,
        flexGrow: 1
    },
    headerContainer: {
        marginBottom: 30,
        marginTop: 10
    },
    backButton: {
        marginBottom: 15
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5
    },
    headerSub: {
        fontSize: 16,
        color: '#666'
    },
    formContainer: {
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#1a1a1a'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
        color: '#333'
    },
    typeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    typeButton: {
        flex: 0.48,
        flexDirection: 'row',
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    activeType: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        elevation: 3,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    typeText: {
        marginLeft: 8,
        fontWeight: '600',
        color: '#666',
        fontSize: 15
    },
    activeTypeText: {
        color: 'white'
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    footerText: {
        color: '#666',
        fontSize: 15
    },
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 15
    }
});

export default RegisterScreen;
