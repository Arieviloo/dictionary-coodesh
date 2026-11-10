import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import wordDictionaryData from '../../data/mock/words_dictionary.json';
import { WordItem } from '../components/WordItem';
import { useWordStore } from '../stores/useWordStore';

const PAGE_SIZE = 20;

export const HomeScreen = ({ onSelectWord }: { onSelectWord: (word: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'words' | 'history' | 'favorites'>('words');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  const { history, favorites, addToHistory } = useWordStore();

  // Transforma o objeto JSON da Coodesh em um array de palavras ordenado/otimizado
  const allWords = useMemo(() => Object.keys(wordDictionaryData), []);

  const handleLoadMore = () => {
    if (activeTab === 'words' && visibleCount < allWords.length) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  };

  const handleWordClick = useCallback((word: string) => {
    addToHistory(word);
    onSelectWord(word);
  }, [addToHistory, onSelectWord]);

  const getData = () => {
    switch (activeTab) {
      case 'history':
        return history;
      case 'favorites':
        return favorites;
      default:
        return allWords.slice(0, visibleCount);
    }
  };

  return (
    <View style={styles.container}>
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
          data={getData()}
          numColumns={3}
          renderItem={({ item }) => <WordItem word={item} onPress={handleWordClick} />}
        //   estimatedItemSize={50}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          keyExtractor={(item, index) => `${item}-${index}`}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma palavra encontrada nesta seção.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 50 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#cbd5e1' },
  activeTab: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#2563eb' },
  listContainer: { flex: 1, paddingHorizontal: 8 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 14 },
});