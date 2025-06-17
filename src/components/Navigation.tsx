
import { Link, useLocation } from 'react-router-dom';
import { Tv, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEpisodes } from '@/hooks/useEpisodes';
import { cn } from '@/lib/utils';

export function Navigation() {
  const location = useLocation();
  const { getFavoriteEpisodes } = useEpisodes();
  const favoriteCount = getFavoriteEpisodes().length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/50 bg-card/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-portal rounded-full flex items-center justify-center animate-pulse-portal">
              <div className="w-4 h-4 bg-black rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-foreground">
              Rick & Morty
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className={cn(
                  "transition-colors",
                  isActive('/') 
                    ? "bg-portal text-black hover:bg-portal-dark" 
                    : "text-foreground hover:text-portal hover:bg-portal/10"
                )}
              >
                <Tv className="h-4 w-4 mr-2" />
                Episódios
              </Button>
            </Link>

            <Link to="/favorites">
              <Button
                variant={isActive('/favorites') ? 'default' : 'ghost'}
                className={cn(
                  "transition-colors relative",
                  isActive('/favorites') 
                    ? "bg-portal text-black hover:bg-portal-dark" 
                    : "text-foreground hover:text-portal hover:bg-portal/10"
                )}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
                {favoriteCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-red-900/20 text-red-400 border-red-400/30 text-xs"
                  >
                    {favoriteCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
