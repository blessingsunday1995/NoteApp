import { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from '../../components/OfflineBanner';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
};

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const fetchNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setNotes(data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch notes');
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  }, [fetchNotes]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('notes').delete().eq('id', id);
          if (error) {
            Alert.alert('Error', error.message);
          } else {
            fetchNotes();
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
           router.replace('/'); 
        },
      },
    ]);
  };

  return (
    <View style={styles.container} >
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/(app)/profile')}>
            <Ionicons name="person-outline" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 16 }}>
            <Ionicons name="log-out-outline" size={28} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onPress={() =>
              router.push({
                pathname: '/(app)/view-note/[id]', // ← Navigate to view page
                params: { id: item.id },
              })
            }
          >
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.notePreview} numberOfLines={2}>
                {item.content}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet. Create one!</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/(app)/note/[id]',
            params: { id: 'new' },
          })
        }
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  noteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteContent: {
    flex: 1,
    marginRight: 16,
  },
  noteTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  notePreview: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});