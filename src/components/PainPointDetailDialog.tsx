import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Send, ThumbsUp } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_anonymous: boolean;
  display_name?: string;
}

// Mock data for who liked - in real app this would come from database
const MOCK_LIKERS = [
  'John Tan',
  'Sarah Lee',
  'Michael Wong',
  'Emily Chen',
  'David Lim',
  'Jessica Ng',
  'Kevin Goh',
  'Amanda Teo',
];

interface PainPointDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  painPointId: string;
  title: string;
  description: string | null;
  submitterName: string;
  submitterDepartment?: string | null;
  isAnonymous?: boolean;
  voteCount: number;
  hasVoted: boolean;
  createdAt: string;
  onUpvote: (id: string) => void;
}

export function PainPointDetailDialog({
  open,
  onOpenChange,
  painPointId,
  title,
  description,
  submitterName,
  submitterDepartment,
  isAnonymous = false,
  voteCount,
  hasVoted,
  createdAt,
  onUpvote,
}: PainPointDetailDialogProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = isAnonymous ? 'Anonymous' : submitterName;

  // Generate mock likers based on vote count
  const likers = MOCK_LIKERS.slice(0, Math.min(voteCount, MOCK_LIKERS.length));
  const extraLikers = voteCount > MOCK_LIKERS.length ? voteCount - MOCK_LIKERS.length : 0;

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        is_anonymous,
        profiles!inner(display_name)
      `)
      .eq('pain_point_id', painPointId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(
        (data || []).map((c: any) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          user_id: c.user_id,
          is_anonymous: c.is_anonymous,
          display_name: c.is_anonymous ? 'Anonymous' : c.profiles?.display_name || 'Unknown'
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (open && painPointId) {
      fetchComments();
    }
  }, [open, painPointId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      pain_point_id: painPointId,
      user_id: user.id,
      content: newComment.trim(),
      is_anonymous: false
    });
    if (error) {
      toast.error('Failed to post comment');
    } else {
      await fetchComments();
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  // Parse description to extract challenge and impact
  const parseDescription = (desc: string | null) => {
    if (!desc) return { challenge: '', impact: '' };
    
    const challengeMatch = desc.match(/\*\*Workplace Challenge:\*\*\n([\s\S]*?)(?=\n\n\*\*Impact:|$)/);
    const impactMatch = desc.match(/\*\*Impact:\*\*\n([\s\S]*?)$/);
    
    return {
      challenge: challengeMatch ? challengeMatch[1].trim() : desc,
      impact: impactMatch ? impactMatch[1].trim() : ''
    };
  };

  const { challenge, impact } = parseDescription(description);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-8">{title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{displayName}</span>
            {!isAnonymous && submitterDepartment && (
              <>
                <span>•</span>
                <span>{submitterDepartment}</span>
              </>
            )}
            <span>•</span>
            <span>{format(new Date(createdAt), 'dd MMM yyyy')}</span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {/* Description */}
            <div className="space-y-4">
              {challenge && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Workplace Challenge</h4>
                  <p className="text-foreground whitespace-pre-wrap">{challenge}</p>
                </div>
              )}
              {impact && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Impact</h4>
                  <p className="text-foreground whitespace-pre-wrap">{impact}</p>
                </div>
              )}
            </div>

            {/* Likes section */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant={hasVoted ? "secondary" : "outline"}
                size="sm"
                onClick={() => onUpvote(painPointId)}
                disabled={hasVoted}
                className={hasVoted ? "bg-orange-100 text-primary hover:bg-orange-100" : ""}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${hasVoted ? 'fill-current' : ''}`} />
                {hasVoted ? 'Liked' : 'Like'}
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer">
                      {voteCount} {voteCount === 1 ? 'like' : 'likes'}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    {voteCount === 0 ? (
                      <p className="text-sm">No likes yet</p>
                    ) : (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Liked by:</p>
                        <ul className="list-none">
                          {likers.map((name, i) => (
                            <li key={i}>{name}</li>
                          ))}
                          {extraLikers > 0 && (
                            <li className="text-muted-foreground">and {extraLikers} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Comment input */}
            <form onSubmit={handleSubmit} className="pt-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <Button type="submit" size="icon" disabled={isSubmitting || !newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Comments section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Comments ({comments.length})
              </h4>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-4">Loading...</p>
              ) : comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg p-3 bg-muted">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.display_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), 'dd MMM, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
