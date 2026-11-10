import { useQuery } from '@tanstack/react-query';
import { DictionaryRepository, WordResponse } from '../../data/repositories/DictionaryRepository';

const dictionaryRepository = new DictionaryRepository();

export function useWordQuery(word: string) {
  return useQuery<WordResponse[], Error>({
    queryKey: ['word', word],
    queryFn: () => dictionaryRepository.getWordDetails(word),
    enabled: !!word && word.trim().length > 0,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30, 
  });
}