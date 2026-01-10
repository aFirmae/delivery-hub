import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

const ProfileScreen = ({ navigation }) => {
	const { userInfo, logout } = useContext(AuthContext);
    const [earnings, setEarnings] = useState(null);

    const fetchEarnings = async () => {
        if (userInfo?.user_type === 'delivery_partner') {
            try {
                const response = await client.get('/orders/partner/earnings');
                setEarnings(response.data);
            } catch (error) {
                console.log('Error fetching earnings', error);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEarnings();
        }, [userInfo])
    );

	return (
		<SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{userInfo?.name?.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.name}>{userInfo?.name}</Text>
                    <Text style={styles.email}>{userInfo?.email}</Text>
                    {/* Hide "Sender" label, show only for Partner */}
                    {userInfo?.user_type === 'delivery_partner' && (
                         <Text style={styles.role}>Delivery Partner</Text>
                    )}
                </View>

                {/* Earnings Section for Partners */}
                {userInfo?.user_type === 'delivery_partner' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Earnings</Text>
                        <View style={styles.earningsCard}>
                             <View>
                                 <Text style={styles.earningsLabel}>Total Earned</Text>
                                 <Text style={styles.earningsValue}>${parseFloat(earnings?.total || 0).toFixed(2)}</Text>
                             </View>
                             <TouchableOpacity 
                                style={styles.viewHistoryButton}
                                onPress={() => navigation.navigate('DailyEarnings')}
                             >
                                 <Text style={styles.viewHistoryText}>View Daily</Text>
                                 <Feather name="chevron-right" size={16} color="#007AFF" />
                             </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Account Details</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                            <Text style={styles.editLink}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>{userInfo?.phone || 'Not provided'}</Text>
                    </View>
                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>{userInfo?.email}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
    scroll: {
        paddingBottom: 20
    },
	header: {
		padding: 20,
		paddingBottom: 10,
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	profileInfo: {
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
		marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
	},
	avatarContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
        elevation: 5,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5
	},
	avatarText: {
		color: 'white',
		fontSize: 40,
		fontWeight: 'bold',
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 5,
	},
	email: {
		fontSize: 16,
		color: '#666',
		marginBottom: 5,
        textAlign: 'center'
	},
	role: {
		fontSize: 14,
		color: '#007AFF',
		fontWeight: '600',
		backgroundColor: '#e6f0ff',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 15,
		overflow: 'hidden',
        marginTop: 5
	},
	section: {
		backgroundColor: '#fff',
		padding: 20,
		marginBottom: 20,
        borderRadius: 12,
        marginHorizontal: 15, 
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
	},
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
    editLink: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16
    },
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
	},
	detailLabel: {
		fontSize: 16,
		color: '#666',
        fontWeight: '500'
	},
	detailValue: {
		fontSize: 16,
		color: '#1a1a1a',
		fontWeight: '500',
        flex: 1,
        textAlign: 'right',
        flexWrap: 'wrap'
	},
    earningsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
    },
    earningsLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5
    },
    earningsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28a745'
    },
    viewHistoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 20
    },
    viewHistoryText: {
        color: '#007AFF',
        fontWeight: '600',
        marginRight: 2
    },
	logoutButton: {
		margin: 20,
		backgroundColor: '#FF3B30',
		padding: 18,
		borderRadius: 12,
		alignItems: 'center',
        elevation: 2
	},
	logoutText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default ProfileScreen;
