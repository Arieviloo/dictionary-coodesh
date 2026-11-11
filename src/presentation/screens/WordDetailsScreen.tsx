import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useWordQuery } from '../../presentation/hooks/useWordQuery';
import { useWordStore } from '../../presentation/stores/useWordStore';
import { AudioPlayerButton } from '../components/AudioPlayerButton';

interface WordDetailsScreenProps {
  word: string;
  onBack: () => void;
}

export const WordDetailsScreen = ({ word, onBack }: WordDetailsScreenProps) => {
  const { data, isLoading, error } = useWordQuery(word);
  const { isFavorite, addFavorite, removeFavorite } = useWordStore();

  const favorite = isFavorite(word);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(word);
    } else {
      addFavorite(word);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Buscando significados na API...</Text>
      </View>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Não foi possível encontrar definições para "{word}".</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Voltar para a lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const wordInfo = data?.[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backTouch}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.favButton}>
          <Text style={styles.favText}>{favorite ? '★ Favorito' : '☆ Favoritar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.wordTitle}>{wordInfo.word}</Text>
        {wordInfo.phonetic && <Text style={styles.phonetic}>Fonética: {wordInfo.phonetic}</Text>}
        
        <AudioPlayerButton word={wordInfo?.word}/>

        {wordInfo.meanings.map((meaning, index) => (
          <View key={index} style={styles.meaningCard}>
            <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
            {meaning.definitions.map((def, defIndex) => (
              <View key={defIndex} style={styles.defContainer}>
                <Text style={styles.definition}>• {def.definition}</Text>
                {def.example && <Text style={styles.example}>Ex: "{def.example}"</Text>}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  backTouch: {
    paddingVertical: 8,
  },

  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },

  favButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },

  favText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  wordTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'capitalize',
  },

  phonetic: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 16,
    fontStyle: 'italic',
  },

  meaningCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  partOfSpeech: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  defContainer: {
    marginBottom: 10,
  },

  definition: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },

  example: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 12,
  },

  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },

  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },

  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
