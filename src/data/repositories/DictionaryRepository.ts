import { WordResponse } from "../../@types/WordResponse";
import { httpClient } from "../api/httpClient";

export class DictionaryRepository {
  async getWordDetails(word: string): Promise<WordResponse[]> {
    const response = await httpClient.get<WordResponse[]>(`/${encodeURIComponent(word.toLowerCase().trim())}`);
    return response.data;
  }
}