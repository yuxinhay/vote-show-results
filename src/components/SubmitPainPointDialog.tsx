import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SubmitPainPointDialogProps {
  onSubmit: (title: string, isAnonymous?: boolean) => Promise<boolean>;
}

export function SubmitPainPointDialog({ onSubmit }: SubmitPainPointDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please describe the problem');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(title.trim(), isAnonymous);
    setIsSubmitting(false);

    if (success) {
      toast.success('Submitted! Your pain point will be reviewed before publishing.');
      setTitle('');
      setIsAnonymous(false);
      setOpen(false);
    } else {
      toast.error('Failed to submit. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Submit Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a Pain Point</DialogTitle>
          <DialogDescription>
            Share a workplace problem you're experiencing
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-muted border-muted-foreground/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Submission Criteria:</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>The problem must not have an existing known solution</li>
              <li>It should be a genuine pain point affecting work</li>
              <li>Be specific and clear in your description</li>
              <li>Submissions will be reviewed before publishing</li>
            </ul>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">What's the problem? *</Label>
            <Textarea
              id="title"
              placeholder="Describe the pain point in detail..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
            <div>
              <Label htmlFor="anonymous" className="text-sm font-medium">Submit Anonymously</Label>
              <p className="text-xs text-muted-foreground">Your name won't be shown publicly</p>
            </div>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
