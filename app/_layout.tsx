// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import OfflineBanner from '../components/OfflineBanner';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
           <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
 
});