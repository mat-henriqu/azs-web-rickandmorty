
import { useLocalStorage } from './useLocalStorage';

export interface EpisodeState {
  id: string;
  isFavorite: boolean;
  isWatched: boolean;
}

export function useEpisodes() {
  const [episodeStates, setEpisodeStates] = useLocalStorage<Record<string, EpisodeState>>('episode-states', {});

  const toggleFavorite = (episodeId: string) => {
    setEpisodeStates(prev => ({
      ...prev,
      [episodeId]: {
        ...prev[episodeId],
        id: episodeId,
        isFavorite: !prev[episodeId]?.isFavorite,
        isWatched: prev[episodeId]?.isWatched || false,
      }
    }));
  };

  const toggleWatched = (episodeId: string) => {
    setEpisodeStates(prev => ({
      ...prev,
      [episodeId]: {
        ...prev[episodeId],
        id: episodeId,
        isFavorite: prev[episodeId]?.isFavorite || false,
        isWatched: !prev[episodeId]?.isWatched,
      }
    }));
  };

  const isFavorite = (episodeId: string) => episodeStates[episodeId]?.isFavorite || false;
  const isWatched = (episodeId: string) => episodeStates[episodeId]?.isWatched || false;

  const getFavoriteEpisodes = () => 
    Object.values(episodeStates).filter(state => state.isFavorite).map(state => state.id);

  return {
    toggleFavorite,
    toggleWatched,
    isFavorite,
    isWatched,
    getFavoriteEpisodes,
  };
}
