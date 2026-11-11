import { act } from '@testing-library/react-native';
import { useWordStore } from '../useWordStore';

describe('useWordStore', () => {
  beforeEach(async () => {
    await act(async () => {
      useWordStore.getState().resetStore();
    });
  });

  it('should add a word to history without duplicates', async () => {
    await act(async () => {
      await useWordStore.getState().addToHistory('hello');
      await useWordStore.getState().addToHistory('world');
      await useWordStore.getState().addToHistory('hello');
    });

    const { history } = useWordStore.getState();
    expect(history).toEqual(['hello', 'world']);
  });

  it('should toggle favorite words correctly', async () => {
    await act(async () => {
      await useWordStore.getState().addFavorite('apple');
    });

    expect(useWordStore.getState().isFavorite('apple')).toBe(true);

    await act(async () => {
      await useWordStore.getState().removeFavorite('apple');
    });

    expect(useWordStore.getState().isFavorite('apple')).toBe(false);
  });

  it('should reset store completely', async () => {
    await act(async () => {
      await useWordStore.getState().addFavorite('test');
      useWordStore.getState().resetStore();
    });

    expect(useWordStore.getState().favorites).toEqual([]);
    expect(useWordStore.getState().history).toEqual([]);
  });
});