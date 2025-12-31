// components/OfflineBanner.tsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from '../constants/colors';

export default function OfflineBanner() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    // Listen for changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected === null || isConnected) {
    return null; // Online or checking → show nothing
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.error,
    padding: 12,
    alignItems: 'center',
  },
  text: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
});