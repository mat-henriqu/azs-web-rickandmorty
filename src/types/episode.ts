
export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
  type: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
}

export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
  characters: Character[];
}

export interface EpisodesResponse {
  episodes: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Episode[];
  };
}

export interface EpisodeDetailResponse {
  episode: Episode;
}
