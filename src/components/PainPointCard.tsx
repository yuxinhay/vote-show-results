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
  onUpvote
}: PainPointCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const displayName = isAnonymous ? 'Anonymous' : submitterName;
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
  return <>
      <Card className="h-full flex flex-col border-l-4 border-l-primary/60 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <CardContent className="flex flex-col flex-1 p-5">
          <p className="text-xs mb-2 text-gray-600">
            {format(new Date(createdAt), 'dd MMM yyyy')}
          </p>
          
          <h3 className="font-medium text-foreground mb-3 flex-1 line-clamp-3">
            {title}
          </h3>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <p className="text-sm text-gray-600">{displayName}</p>
            
            <div className="flex items-center gap-3">
              <button onClick={handleCommentClick} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{commentCount}</span>
              </button>
              <button onClick={handleUpvoteClick} disabled={hasVoted} className={`flex items-center gap-1 text-sm transition-colors ${hasVoted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
                <span>{voteCount}</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PainPointDetailDialog open={detailOpen} onOpenChange={setDetailOpen} painPointId={id} title={title} description={description} submitterName={submitterName} submitterDepartment={submitterDepartment} isAnonymous={isAnonymous} voteCount={voteCount} hasVoted={hasVoted} createdAt={createdAt} onUpvote={onUpvote} />
    </>;
}