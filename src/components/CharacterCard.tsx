
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types/episode';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'bg-green-900/20 text-green-400 border-green-400/30';
    case 'dead':
      return 'bg-red-900/20 text-red-400 border-red-400/30';
    default:
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/30';
  }
};

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div className="character-card">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={character.image}
            alt={character.name}
            className="w-16 h-16 rounded-lg object-cover border border-portal/20"
            loading="lazy"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate mb-1">
            {character.name}
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", getStatusColor(character.status))}
            >
              {character.status}
            </Badge>
            <Badge variant="outline" className="text-xs text-rick border-rick/30">
              {character.species}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {character.origin.name}
          </p>
        </div>
      </div>
    </div>
  );
}
