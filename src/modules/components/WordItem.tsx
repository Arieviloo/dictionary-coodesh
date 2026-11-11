import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useWordStore } from '../stores/useWordStore';
import AntDesign from '@expo/vector-icons/AntDesign'


interface WordItemProps {
  word: string;
  onPress: (word: string) => void;
}

export const WordItem = React.memo(({ word, onPress }: WordItemProps) => {
  const isFavorite = useWordStore((state) => state.isFavorite(word));

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(word)}>
      {isFavorite && 
      <View style={styles.star}>
        <AntDesign name="star" size={12} color="#eab308" />
      </View>}
      <Text style={styles.text}>{word}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    paddingVertical: 18,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  star: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
});