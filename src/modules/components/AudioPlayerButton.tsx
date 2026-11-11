import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

interface AudioPlayerButtonProps {
  word?: string;
}

export const AudioPlayerButton = ({ word }: AudioPlayerButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!word) return null;

  const speakWord = async () => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      setIsPlaying(true);
      Speech.speak(word, {
        language: 'en-US',
        rate: 0.9,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    } catch (error) {
      console.error('Erro na síntese de voz:', error);
      setIsPlaying(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, isPlaying && styles.playing]} 
      onPress={speakWord}
    >
      <Text style={styles.icon}>🔊</Text>
      <Text style={styles.text}>{isPlaying ? 'Reproduzindo...' : 'Ouvir Pronúncia'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  playing: {
    backgroundColor: '#dbeafe',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 14,
  },
});