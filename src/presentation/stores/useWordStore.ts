import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

interface WordState {
  favorites: string[];
  history: string[];
  loadUserData: () => Promise<void>;
  addFavorite: (word: string) => Promise<void>;
  removeFavorite: (word: string) => Promise<void>;
  isFavorite: (word: string) => boolean;
  addToHistory: (word: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  resetStore: () => void;
}

export const useWordStore = create<WordState>((set, get) => ({
  favorites: [],
  history: [],

  resetStore: () => set({ favorites: [], history: [] }), 
  loadUserData: async () => {
    const user = auth.currentUser;
    if (!user) {
      set({ favorites: [], history: [] });
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          favorites: data.favorites || [],
          history: data.history || [],
        });
      } else {
        set({ favorites: [], history: [] });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do Firestore:', error);
    }
  },

  addFavorite: async (word: string) => {
    const { favorites, history } = get();
    if (favorites.includes(word)) return;

    const updatedFavorites = [word, ...favorites];
    set({ favorites: updatedFavorites });

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          favorites: updatedFavorites,
          history,
        }, { merge: true });
      } catch (error) {
        console.error('Erro ao salvar favorito na nuvem:', error);
      }
    }
  },

  removeFavorite: async (word: string) => {
    const { favorites, history } = get();
    const updatedFavorites = favorites.filter((item) => item !== word);
    set({ favorites: updatedFavorites });

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          favorites: updatedFavorites,
          history,
        }, { merge: true });
      } catch (error) {
        console.error('Erro ao remover favorito na nuvem:', error);
      }
    }
  },

  isFavorite: (word: string) => {
    return get().favorites.includes(word);
  },

  addToHistory: async (word: string) => {
    const { favorites, history } = get();
    const filtered = history.filter((item) => item !== word);
    const updatedHistory = [word, ...filtered].slice(0, 50);
    set({ history: updatedHistory });

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          favorites,
          history: updatedHistory,
        }, { merge: true });
      } catch (error) {
        console.error('Erro ao salvar histórico na nuvem:', error);
      }
    }
  },

  clearHistory: async () => {
    const { favorites } = get();
    set({ history: [] });

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          favorites,
          history: [],
        }, { merge: true });
      } catch (error) {
        console.error('Erro ao limpar histórico na nuvem:', error);
      }
    }
  },
}));