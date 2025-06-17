
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo';
import { GET_EPISODE_DETAIL } from '@/lib/queries';
import { EpisodeDetailResponse } from '@/types/episode';
import { CharacterCard } from '@/components/CharacterCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEpisodes } from '@/hooks/useEpisodes';
import { ArrowLeft, Heart, Eye, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EpisodeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, toggleWatched, isFavorite, isWatched } = useEpisodes();

  const { data, isLoading, error } = useQuery({
    queryKey: ['episode', id],
    queryFn: async () => {
      return apolloClient.query<EpisodeDetailResponse>({
        query: GET_EPISODE_DETAIL,
        variables: { id },
      });
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erro ao carregar episódio</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const episode = data?.data.episode;
  if (!episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Episódio não encontrado</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const episodeIsFavorite = isFavorite(episode.id);
  const episodeIsWatched = isWatched(episode.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-portal hover:text-portal-light"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-portal border-portal">
                  {episode.episode}
                </Badge>
                {episodeIsWatched && (
                  <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-400/30">
                    Assistido
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {episode.name}
              </h1>

              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{episode.air_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{episode.characters.length} personagens</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => toggleFavorite(episode.id)}
                className={cn(
                  "border-border/50",
                  episodeIsFavorite 
                    ? "text-red-400 border-red-400/50 bg-red-900/10 hover:bg-red-900/20" 
                    : "hover:text-red-400 hover:border-red-400/50"
                )}
              >
                <Heart className={cn("h-4 w-4 mr-2", episodeIsFavorite && "fill-current")} />
                {episodeIsFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toggleWatched(episode.id)}
                className={cn(
                  "border-border/50",
                  episodeIsWatched 
                    ? "text-green-400 border-green-400/50 bg-green-900/10 hover:bg-green-900/20" 
                    : "hover:text-green-400 hover:border-green-400/50"
                )}
              >
                <Eye className={cn("h-4 w-4 mr-2", episodeIsWatched && "fill-current")} />
                {episodeIsWatched ? 'Marcar como Não Assistido' : 'Marcar como Assistido'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Characters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Personagens do Episódio
          </h2>
          <p className="text-muted-foreground">
            {episode.characters.length} personagens participaram deste episódio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {episode.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>
    </div>
  );
}
