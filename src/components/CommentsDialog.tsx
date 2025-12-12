import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  painPointTitle
}: CommentsDialogProps) {
  const {
    user
  } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const {
      error
    } = await supabase.from('comments').insert({
      pain_point_id: painPointId,
      user_id: user.id,
      content: newComment.trim(),
      is_anonymous: isAnonymous
    });
    if (error) {
      toast.error('Failed to post comment');
    } else {
      await fetchComments();
      setNewComment('');
      setIsAnonymous(false);
    }
    setIsSubmitting(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Comments</DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{painPointTitle}</p>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : comments.length === 0 ? <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p> : <div className="space-y-4">
              {comments.map(comment => <div key={comment.id} className="rounded-lg p-3 bg-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {comment.display_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'dd MMM, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>)}
            </div>}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t">
          <div className="flex gap-2">
            <Textarea placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} className="min-h-[60px] resize-none" />
            <Button type="submit" size="icon" disabled={isSubmitting || !newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="anonymous-comment" checked={isAnonymous} onCheckedChange={checked => setIsAnonymous(checked === true)} />
            <Label htmlFor="anonymous-comment" className="text-sm text-muted-foreground cursor-pointer">
              Post anonymously
            </Label>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}