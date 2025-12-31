// app/welcome.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    // Wait 2 seconds, then redirect based on auth state
    const timer = setTimeout(() => {
      if (!loading) {
        if (session) {
          router.replace('/(app)/notes'); // logged in → notes
        } else {
          router.replace('/'); // not logged in → login
        }
      }
    }, 2000); // 2 seconds welcome screen

    return () => clearTimeout(timer);
  }, [session, loading, router]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} // optional nice background
        style={styles.background}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Notes App</Text>
        {/* <Text style={styles.subtitle}>Capture your thoughts, anywhere</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
});