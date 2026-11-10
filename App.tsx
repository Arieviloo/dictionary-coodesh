import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from './src/presentation/screens/HomeScreen';

const queryClient = new QueryClient();

export default function App() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {selectedWord ? (
          <View style={styles.center}>
            <Text style={styles.title}>Palavra Selecionada: {selectedWord}</Text>
            <Text style={styles.back} onPress={() => setSelectedWord(null)}>← Voltar para lista</Text>
          </View>
        ) : (
          <HomeScreen onSelectWord={(word) => setSelectedWord(word)} />
        )}
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  back: { marginTop: 16, color: '#2563eb', fontSize: 16, fontWeight: '600' },
});