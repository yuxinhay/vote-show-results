import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle, PartyPopper } from 'lucide-react';

interface SubmitPainPointDialogProps {
  onSubmit: (title: string, isAnonymous?: boolean) => Promise<boolean>;
}

export function SubmitPainPointDialog({ onSubmit }: SubmitPainPointDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(true); // TODO: revert to false

  useEffect(() => {
    if (showSuccessModal) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [showSuccessModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(title.trim(), isAnonymous);
    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setIsAnonymous(false);
      setOpen(false);
      setShowSuccessModal(true);
    }
  };

  return (
    <>
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

          <Alert className="bg-[#e8e8e8] border-gray-200">
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

            <div className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${isAnonymous ? 'bg-green-100' : 'bg-[#e8e8e8]'}`}>
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
              <Button type="submit" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <PartyPopper className="h-16 w-16 text-primary mb-2" />
            <AlertDialogTitle>Submission Received!</AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Thank you for your submission! Your pain point has been received and will be reviewed by our team before it appears on the main page. This process helps ensure all submissions meet our quality guidelines.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessModal(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
