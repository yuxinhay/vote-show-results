import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_anonymous: boolean;
  display_name?: string;
}

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  painPointId: string;
  painPointTitle: string;
}

export function CommentsDialog({
  open,
  onOpenChange,
  painPointId,
  painPointTitle,
}: CommentsDialogProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // TEMP: Mock comments for UI editing (bypasses RLS auth requirement)
  useEffect(() => {
    if (open && painPointId) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setComments([
          {
            id: '1',
            content: 'This is a really frustrating issue. We deal with this almost every day in our department.',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            user_id: 'user1',
            is_anonymous: false,
            display_name: 'Sarah Chen',
          },
          {
            id: '2',
            content: 'Agreed! Would love to see this addressed soon.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: 'user2',
            is_anonymous: true,
            display_name: 'Anonymous',
          },
          {
            id: '3',
            content: 'We tried a workaround last quarter but it only partially solved the problem. A proper fix would save us hours each week.',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            user_id: 'user3',
            is_anonymous: false,
            display_name: 'Michael Tan',
          },
          {
            id: '4',
            content: '+1 on this. Definitely a priority for our team.',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user_id: 'user4',
            is_anonymous: false,
            display_name: 'Jane Lim',
          },
        ]);
        setIsLoading(false);
      }, 300);
    }
  }, [open, painPointId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('comments')
      .insert({
        pain_point_id: painPointId,
        user_id: user.id,
        content: newComment.trim(),
        is_anonymous: isAnonymous,
      });

    if (error) {
      toast.error('Failed to post comment');
    } else {
      // TEMP: Add mock new comment for UI editing
      setComments(prev => [...prev, {
        id: Date.now().toString(),
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        user_id: 'current',
        is_anonymous: isAnonymous,
        display_name: isAnonymous ? 'Anonymous' : 'You',
      }]);
      setNewComment('');
      setIsAnonymous(false);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Comments</DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{painPointTitle}</p>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {comment.display_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'dd MMM, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t">
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous-comment"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            />
            <Label htmlFor="anonymous-comment" className="text-sm text-muted-foreground cursor-pointer">
              Post anonymously
            </Label>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
