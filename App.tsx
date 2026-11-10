import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { WordDetailsScreen } from './src/presentation/screens/WordDetailsScreen';

const queryClient = new QueryClient();

export default function App() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {selectedWord ? (
          <WordDetailsScreen word={selectedWord} onBack={() => setSelectedWord(null)} />
        ) : (
          <HomeScreen onSelectWord={(word) => setSelectedWord(word)} />
        )}
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
});