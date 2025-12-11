import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';

interface PainPointCardProps {
  id: string;
  title: string;
  submitterName: string;
  submitterDepartment?: string | null;
  voteCount: number;
  hasVoted: boolean;
  createdAt: string;
  onUpvote: (id: string) => void;
}

export function PainPointCard({
  id,
  title,
  submitterName,
  submitterDepartment,
  voteCount,
  hasVoted,
  createdAt,
  onUpvote,
}: PainPointCardProps) {
  const initials = submitterName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="h-full flex flex-col border-l-4 border-l-primary/60 hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col flex-1 p-5">
        <p className="text-xs text-muted-foreground mb-2">
          {format(new Date(createdAt), 'dd MMM yyyy')}
        </p>
        
        <h3 className="font-medium text-foreground mb-3 flex-1 line-clamp-3">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ThumbsUp className="h-4 w-4" />
          <span>{voteCount} {voteCount === 1 ? 'Like' : 'Likes'}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{submitterName}</p>
              {submitterDepartment && (
                <p className="text-xs text-muted-foreground">{submitterDepartment}</p>
              )}
            </div>
          </div>
          
          <Button
            variant={hasVoted ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onUpvote(id)}
            disabled={hasVoted}
            className={hasVoted ? "text-primary" : "text-muted-foreground hover:text-primary"}
          >
            <ThumbsUp className={`h-5 w-5 ${hasVoted ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
