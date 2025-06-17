
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo';
import { GET_EPISODES, SEARCH_EPISODES } from '@/lib/queries';
import { EpisodesResponse } from '@/types/episode';
import { EpisodeCard } from '@/components/EpisodeCard';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Tv } from 'lucide-react';

export default function Episodes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['episodes', currentPage, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return apolloClient.query<EpisodesResponse>({
          query: SEARCH_EPISODES,
          variables: { name: searchQuery },
        });
      }
      return apolloClient.query<EpisodesResponse>({
        query: GET_EPISODES,
        variables: { page: currentPage },
      });
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (data?.data.episodes.info.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (data?.data.episodes.info.prev) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">Erro ao carregar episódios</p>
        <Button onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const episodes = data?.data.episodes.results || [];
  const pageInfo = data?.data.episodes.info;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Tv className="h-8 w-8 text-portal" />
            <h1 className="text-3xl font-bold text-foreground">
              Rick and Morty
            </h1>
            <Badge variant="outline" className="text-portal border-portal">
              Episódios
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Buscar por nome do episódio..."
            />
            {pageInfo && (
              <div className="text-sm text-muted-foreground">
                {searchQuery ? (
                  `${episodes.length} resultado(s) encontrado(s)`
                ) : (
                  `${pageInfo.count} episódios • Página ${currentPage} de ${pageInfo.pages}`
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {episodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {searchQuery ? 'Nenhum episódio encontrado' : 'Nenhum episódio disponível'}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => handleSearch('')}>
                Limpar Busca
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && pageInfo && pageInfo.pages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={!pageInfo.prev}
                  className="border-portal/30 text-portal hover:bg-portal/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                
                <span className="text-sm text-muted-foreground px-4">
                  Página {currentPage} de {pageInfo.pages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!pageInfo.next}
                  className="border-portal/30 text-portal hover:bg-portal/10"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
