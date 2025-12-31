import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/'); // Redirect to login
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to log out');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color={COLORS.primary} />
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'Not available'}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{user?.id || 'Not available'}</Text>

        <Text style={styles.label}>Last Sign In</Text>
        <Text style={styles.value}>
          {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Not available'}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});