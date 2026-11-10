jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { act } from '@testing-library/react-native';
import { useWordStore } from '../useWordStore';

describe('WordStore (Zustand State & History/Favorites)', () => {
  beforeEach(() => {
    useWordStore.setState({ favorites: [], history: [] });
  });

  it('should add a word to favorites correctly', async () => {
    await act(async () => {
      useWordStore.getState().addFavorite('apple');
    });

    expect(useWordStore.getState().favorites).toContain('apple');
    expect(useWordStore.getState().isFavorite('apple')).toBe(true);
  });

  it('should remove a word from favorites correctly', async () => {
    await act(async () => {
      useWordStore.getState().addFavorite('apple');
      useWordStore.getState().removeFavorite('apple');
    });

    expect(useWordStore.getState().favorites).not.toContain('apple');
    expect(useWordStore.getState().isFavorite('apple')).toBe(false);
  });

  it('should add a word to history and keep unique items at the top', async () => {
    await act(async () => {
      useWordStore.getState().addToHistory('apple');
      useWordStore.getState().addToHistory('ball');
      useWordStore.getState().addToHistory('apple');
    });

    const history = useWordStore.getState().history;
    expect(history[0]).toBe('apple');
    expect(history[1]).toBe('ball');
    expect(history.length).toBe(2);
  });
});