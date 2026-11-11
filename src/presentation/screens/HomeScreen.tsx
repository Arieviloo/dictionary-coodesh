import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import wordDictionaryData from '../../data/mock/words_dictionary.json';
import { WordItem } from '../components/WordItem';
import { useWordStore } from '../stores/useWordStore';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';

const PAGE_SIZE = 20;

export const HomeScreen = ({ onSelectWord }: { onSelectWord: (word: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'words' | 'history' | 'favorites'>('words');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  const { history, favorites, addToHistory } = useWordStore();

  const allWords = useMemo(() => Object.keys(wordDictionaryData), []);

  const currentBaseList = useMemo(() => {
    switch (activeTab) {
      case 'history':
        return history;
      case 'favorites':
        return favorites;
      default:
        return allWords;
    }
  }, [activeTab, history, favorites, allWords]);

  const displayedData = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    
    if (trimmedQuery.length > 0) {
      return currentBaseList.filter((word) =>
        word.toLowerCase().includes(trimmedQuery)
      );
    }

    if (activeTab === 'words') {
      return currentBaseList.slice(0, visibleCount);
    }

    return currentBaseList;
  }, [currentBaseList, searchQuery, activeTab, visibleCount]);

  const handleLoadMore = () => {
    if (activeTab === 'words' && !searchQuery.trim() && visibleCount < allWords.length) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  };

  const handleWordClick = useCallback((word: string) => {
    addToHistory(word);
    onSelectWord(word);
  }, [addToHistory, onSelectWord]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível sair da conta: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dicionário Coodesh</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar palavra..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'words' && styles.activeTab]} 
          onPress={() => setActiveTab('words')}
        >
          <Text style={[styles.tabText, activeTab === 'words' && styles.activeTabText]}>Palavras</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]} 
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favoritos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={displayedData}
          numColumns={3}
          renderItem={({ item }) => <WordItem word={item} onPress={handleWordClick} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? `Nenhuma palavra encontrada para "${searchQuery}".` : 'Nenhuma palavra encontrada nesta seção.'}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 16, 
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  logoutButton: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
  },

  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#cbd5e1',
  },
  activeTab: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#2563eb',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
});