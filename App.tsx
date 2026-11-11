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

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          <AuthScreen onSuccess={() => {}} />
        </View>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <View style={[styles.screenAbsolute, selectedWord ? styles.hidden : styles.visible]} tabIndex={selectedWord ? -1 : 0}>
          <HomeScreen onSelectWord={(word) => setSelectedWord(word)} />
        </View>

        {selectedWord && (
          <View style={styles.screenAbsolute}>
            <WordDetailsScreen word={selectedWord} onBack={() => setSelectedWord(null)} />
          </View>
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
  },
  screenAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
  },
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  }
});