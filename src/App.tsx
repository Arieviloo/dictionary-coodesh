import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { AuthScreen } from './modules/screens/AuthScreen';
import { HomeScreen } from './modules/screens/HomeScreen';
import { WordDetailsScreen } from './modules/screens/WordDetailsScreen';
import { useWordStore } from './modules/stores/useWordStore';

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

  useEffect(() => {
    const backAction = () => {
      if (selectedWord) {
        setSelectedWord(null);
        return true; // Impede que o app feche e volta para a Home
      }
      return false; // Deixa o comportamento padrão (sair do app) se estiver na Home
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [selectedWord]);

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