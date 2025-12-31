import { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../../constants/colors';

export default function NoteEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isNew = id === 'new';

  useEffect(() => {
    if (!isNew) loadNote();
  }, [id]);

  const loadNote = async () => {
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error) Alert.alert('Error', error.message);
    else {
      setTitle(data.title);
      setContent(data.content || '');
    }
  };

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      console.log('Saving note - ID:', id, 'isNew:', isNew);

      if (isNew) {
        const { error } = await supabase
          .from('notes')
          .insert({ title, content });

        if (error) throw error;
      } else {
        // Ensure we have a valid ID for update
        if (!id || typeof id !== 'string') {
          throw new Error('Invalid note ID for update');
        }

        const { error } = await supabase
          .from('notes')
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      }

      Alert.alert('Success', 'Note saved!');
      router.replace('/(app)/notes');
    } catch (error: any) {
      Alert.alert('Error saving note', error.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note Title"
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          placeholderTextColor={COLORS.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <Button title="Save" color={COLORS.primary} onPress={saveNote} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  titleInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    minHeight: 300,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
});