import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Lightbulb, PartyPopper } from "lucide-react";

interface SubmitPainPointDialogProps {
  onSubmit: (title: string, challenge: string, impact: string, interestedInMIC: boolean) => Promise<boolean>;
}

export function SubmitPainPointDialog({ onSubmit }: SubmitPainPointDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [impact, setImpact] = useState("");
  const [interestedInMIC, setInterestedInMIC] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (showSuccessModal) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6,
        },
      });
    }
  }, [showSuccessModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !challenge.trim() || !impact.trim()) {
      return;
    }
    setIsSubmitting(true);
    const success = await onSubmit(title.trim(), challenge.trim(), impact.trim(), interestedInMIC);
    setIsSubmitting(false);
    if (success) {
      setTitle("");
      setChallenge("");
      setImpact("");
      setInterestedInMIC(false);
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit a Problem Statement</DialogTitle>
            <DialogDescription>Share a workplace challenge you're experiencing</DialogDescription>
          </DialogHeader>

          <Alert className="bg-amber-50 border-amber-200">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900">
              <strong>Consider using this structure for your submission:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>What's the current challenge? What are the current workarounds, are there any temporary fixes?</li>
                <li>Who does it affect and how?</li>
                <li>What are the operational/business implications?</li>
                <li>What would success look like?</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert className="bg-amber-100 border-amber-300">
            <AlertDescription className="text-sm text-amber-900">
              <strong>An example of a problem statement</strong>
              <p>
                Staff can only submit leave applications through WOG laptops, limiting flexibility for those working
                remotely, on the move, or needing to apply for urgent leave outside office hours. Approximately 200
                staff are affected weekly, with leave applications delayed by an average of 1-2 days while waiting for
                laptop access. This restriction causes approval backlogs and affects workforce planning, particularly
                impacting the 40% of our workforce who regularly work remotely or are frequently on the move.
              </p>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title of your problem statement *</Label>
              <Input
                id="title"
                placeholder="Enter a short, descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge">Workplace challenge *</Label>
              <Textarea
                id="challenge"
                placeholder="Describe the current challenge, workarounds, and any temporary fixes..."
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required
                className="min-h-[150px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact of your problem *</Label>
              <Textarea
                id="impact"
                placeholder="Describe who is affected, and any operational implications..."
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            <label
              htmlFor="interested"
              className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
            >
              <Checkbox
                id="interested"
                checked={interestedInMIC}
                onCheckedChange={(checked) => setInterestedInMIC(checked as boolean)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <span className="text-sm font-medium">
                  I am interested in joining MIC as part of the solutioning team
                </span>
              </div>
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim() || !challenge.trim() || !impact.trim()}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <PartyPopper className="text-primary mb-2 w-[100px] h-[100px]" />
            <AlertDialogTitle>Thank you for your submission!</AlertDialogTitle>
            <AlertDialogDescription className="pt-2 space-y-3">
              <span className="block">
                Your problem statement is in! We'll review it shortly to ensure it's clear and ready for the community
                to vote on.
              </span>
              <span className="block text-xs italic text-muted-foreground">
                The MIC Programme team may reach out to you for additional information.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessModal(false)}>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
