import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface WordItemProps {
  word: string;
  onPress: (word: string) => void;
}

export const WordItem = React.memo(({ word, onPress }: WordItemProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(word)}>
      <Text style={styles.text}>{word}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
});