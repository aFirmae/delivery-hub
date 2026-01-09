import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
	const { userInfo, logout } = useContext(AuthContext);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Profile</Text>
			</View>
			
			<View style={styles.profileInfo}>
				<View style={styles.avatarContainer}>
					<Text style={styles.avatarText}>{userInfo?.name?.charAt(0).toUpperCase()}</Text>
				</View>
				<Text style={styles.name}>{userInfo?.name}</Text>
				<Text style={styles.email}>{userInfo?.email}</Text>
				<Text style={styles.role}>{userInfo?.user_type === 'sender' ? 'Sender' : 'Delivery Partner'}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Account Details</Text>
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>Phone</Text>
					<Text style={styles.detailValue}>{userInfo?.phone || 'Not provided'}</Text>
				</View>
                {/* Placeholder for future edits */}
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.logoutButton} onPress={logout}>
				<Text style={styles.logoutText}>Logout</Text>
			</TouchableOpacity>
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
        marginHorizontal: 15, // added margin for "floating" look
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 15,
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
	},
    editButton: {
        alignItems: 'center',
        paddingVertical: 10
    },
    editButtonText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16
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
