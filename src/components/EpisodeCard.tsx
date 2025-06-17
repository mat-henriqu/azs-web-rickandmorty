
import { Link } from 'react-router-dom';
import { Heart, Eye, Calendar, Users, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Episode } from '@/types/episode';
import { useEpisodes } from '@/hooks/useEpisodes';
import { cn } from '@/lib/utils';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { toggleFavorite, toggleWatched, isFavorite, isWatched } = useEpisodes();
  
  const episodeIsFavorite = isFavorite(episode.id);
  const episodeIsWatched = isWatched(episode.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(episode.id);
  };

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatched(episode.id);
  };

  return (
    <div className="episode-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-portal border-portal">
              {episode.episode}
            </Badge>
            {episodeIsWatched && (
              <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-400/30">
                Assistido
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-portal transition-colors">
            {episode.name}
          </h3>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className={cn(
              "transition-colors",
              episodeIsFavorite 
                ? "text-red-400 hover:text-red-300" 
                : "text-muted-foreground hover:text-red-400"
            )}
          >
            <Heart className={cn("h-4 w-4", episodeIsFavorite && "fill-current")} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWatchedClick}
            className={cn(
              "transition-colors",
              episodeIsWatched 
                ? "text-green-400 hover:text-green-300" 
                : "text-muted-foreground hover:text-green-400"
            )}
          >
            <Eye className={cn("h-4 w-4", episodeIsWatched && "fill-current")} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{episode.air_date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{episode.characters.length} personagens</span>
        </div>
      </div>

      <Link to={`/episode/${episode.id}`}>
        <Button className="w-full bg-portal hover:bg-portal-dark text-black font-medium">
          <Play className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      </Link>
    </div>
  );
}
