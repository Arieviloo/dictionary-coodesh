import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageAdapter } from '../../data/storage/asyncStorageAdapter';

interface WordStoreState {
  favorites: string[];
  history: string[];
  addFavorite: (word: string) => void;
  removeFavorite: (word: string) => void;
  addToHistory: (word: string) => void;
  isFavorite: (word: string) => boolean;
}

export const useWordStore = create<WordStoreState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],

      addFavorite: (word: string) => {
        const normalized = word.toLowerCase().trim();
        const current = get().favorites;
        if (!current.includes(normalized)) {
          set({ favorites: [normalized, ...current] });
        }
      },

      removeFavorite: (word: string) => {
        const normalized = word.toLowerCase().trim();
        set({ favorites: get().favorites.filter((w) => w !== normalized) });
      },

      addToHistory: (word: string) => {
        const normalized = word.toLowerCase().trim();
        const filteredHistory = get().history.filter((w) => w !== normalized);
        set({ history: [normalized, ...filteredHistory] });
      },

      isFavorite: (word: string) => {
        return get().favorites.includes(word.toLowerCase().trim());
      },
    }),
    {
      name: '@dictionary_app_data',
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);