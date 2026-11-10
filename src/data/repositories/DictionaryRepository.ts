import { httpClient } from "../api/httpClient";

export interface WordResponse {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
    }>;
  }>;
}

export class DictionaryRepository {
  async getWordDetails(word: string): Promise<WordResponse[]> {
    const response = await httpClient.get<WordResponse[]>(`/${encodeURIComponent(word.toLowerCase().trim())}`);
    return response.data;
  }
}