import { useQuery } from '@tanstack/react-query';
import { DictionaryRepository } from '../../data/repositories/DictionaryRepository';

const dictionaryRepository = new DictionaryRepository();

export const useWordDetails = (word: string) => {
  return useQuery({
    queryKey: ['word-definition', word],
    queryFn: () => dictionaryRepository.getWordDetails(word),
    enabled: !!word,
    staleTime: 1000 * 60 * 5, 
  });
};