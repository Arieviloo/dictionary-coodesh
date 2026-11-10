import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.dictionaryapi.dev/api/v2/entries/en',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});