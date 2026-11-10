import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/services/firebase';
import { AuthScreen } from './src/presentation/screens/AuthScreen';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { WordDetailsScreen } from './src/presentation/screens/WordDetailsScreen';
import { useWordStore } from './src/presentation/stores/useWordStore';

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
  const loadUserData = useWordStore((state) => state.loadUserData);
  const resetStore = useWordStore((state) => state.resetStore);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        resetStore();
        await loadUserData();
      } else {
        resetStore();
      }

      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {!user ? (
          <AuthScreen onSuccess={() => {}} />
        ) : selectedWord ? (
          <WordDetailsScreen word={selectedWord} onBack={() => setSelectedWord(null)} />
        ) : (
          <HomeScreen onSelectWord={(word) => setSelectedWord(word)} />
        )}
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f8fafc'
  },
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  }
});