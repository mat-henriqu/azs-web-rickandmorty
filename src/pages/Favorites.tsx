
import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo';
import { GET_EPISODES } from '@/lib/queries';
import { EpisodesResponse } from '@/types/episode';
import { EpisodeCard } from '@/components/EpisodeCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEpisodes } from '@/hooks/useEpisodes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { getFavoriteEpisodes } = useEpisodes();
  const favoriteIds = getFavoriteEpisodes();

  const { data, isLoading, error } = useQuery({
    queryKey: ['all-episodes-for-favorites'],
    queryFn: async () => {
      // Buscar todos os episódios para filtrar os favoritos
      const allEpisodes = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const result = await apolloClient.query<EpisodesResponse>({
          query: GET_EPISODES,
          variables: { page },
        });
        
        allEpisodes.push(...result.data.episodes.results);
        hasNext = result.data.episodes.info.next !== null;
        page++;
      }

      return allEpisodes;
    },
    enabled: favoriteIds.length > 0,
  });

  if (favoriteIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-red-400" />
              <h1 className="text-3xl font-bold text-foreground">
                Episódios Favoritos
              </h1>
              <Badge variant="outline" className="text-red-400 border-red-400/30">
                0 favoritos
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Seus episódios favoritos aparecerão aqui
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Nenhum favorito ainda
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore os episódios e adicione seus favoritos para vê-los aqui
              </p>
            </div>
            <Link to="/">
              <Button className="bg-portal hover:bg-portal-dark text-black">
                <Tv className="h-4 w-4 mr-2" />
                Explorar Episódios
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner size="lg" />;
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">Erro ao carregar favoritos</p>
        <Button onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const favoriteEpisodes = data?.filter(episode => favoriteIds.includes(episode.id)) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-400" />
            <h1 className="text-3xl font-bold text-foreground">
              Episódios Favoritos
            </h1>
            <Badge variant="outline" className="text-red-400 border-red-400/30">
              {favoriteEpisodes.length} favoritos
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Seus episódios favoritos de Rick and Morty
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </div>
  );
}
