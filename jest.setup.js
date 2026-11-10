// Mock global do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock global do serviço Firebase
jest.mock('./src/services/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-user-uid' },
  },
  db: {},
}));

// Mock do Firestore para evitar erros de chamada nas funções do store durante os testes
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => ({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
}));