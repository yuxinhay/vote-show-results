import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PainPointDetailDialog } from './PainPointDetailDialog';

interface PainPointCardProps {
  id: string;
  title: string;
  description?: string | null;
  submitterName: string;
  submitterDepartment?: string | null;
  isAnonymous?: boolean;
  voteCount: number;
  hasVoted: boolean;
  commentCount: number;
  createdAt: string;
  onUpvote: (id: string) => void;
}

export function PainPointCard({
  id,
  title,
  description,
  submitterName,
  submitterDepartment,
  isAnonymous = false,
  voteCount,
  hasVoted,
  commentCount,
  createdAt,
  onUpvote,
}: PainPointCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  const displayName = isAnonymous ? 'Anonymous' : submitterName;

  // Parse description to extract challenge and impact
  const parseDescription = () => {
    if (!description) return { challenge: null, impact: null };
    
    const challengeMatch = description.match(/\*\*Workplace Challenge:\*\*\n([\s\S]*?)(?=\n\n\*\*Impact:\*\*|$)/);
    const impactMatch = description.match(/\*\*Impact:\*\*\n([\s\S]*?)$/);
    
    return {
      challenge: challengeMatch ? challengeMatch[1].trim() : null,
      impact: impactMatch ? impactMatch[1].trim() : null,
    };
  };

  const { challenge, impact } = parseDescription();

  const handleCardClick = () => {
    setDetailOpen(true);
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote(id);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailOpen(true);
  };

  return (
    <>
      <Card 
        className="h-full flex flex-col border-l-4 border-l-primary/60 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="flex flex-col flex-1 p-5">
          <p className="text-xs text-muted-foreground mb-2">
            {format(new Date(createdAt), 'dd MMM yyyy')}
          </p>
          
          <h3 className="font-semibold text-foreground mb-2">
            {title}
          </h3>

          {challenge && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Challenge</p>
              <p className="text-sm text-foreground/80 line-clamp-2">{challenge}</p>
            </div>
          )}

          {impact && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Impact</p>
              <p className="text-sm text-foreground/80 line-clamp-2">{impact}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">{displayName}</p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleCommentClick}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{commentCount}</span>
              </button>
              <button
                onClick={handleUpvoteClick}
                disabled={hasVoted}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  hasVoted 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
                <span>{voteCount}</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PainPointDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        painPointId={id}
        title={title}
        description={description}
        submitterName={submitterName}
        submitterDepartment={submitterDepartment}
        isAnonymous={isAnonymous}
        voteCount={voteCount}
        hasVoted={hasVoted}
        createdAt={createdAt}
        onUpvote={onUpvote}
      />
    </>
  );
}
