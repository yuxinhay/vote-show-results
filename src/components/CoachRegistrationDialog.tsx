import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, PartyPopper, AlertCircle } from "lucide-react";

interface CoachRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoachRegistrationDialog({ open, onOpenChange }: CoachRegistrationDialogProps) {
  const { user } = useAuth();
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasParticipantRegistration, setHasParticipantRegistration] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  useEffect(() => {
    if (open && user) {
      checkExistingRegistration();
    }
  }, [open, user]);

  const checkExistingRegistration = async () => {
    if (!user) {
      setIsCheckingRegistration(false);
      return;
    }

    setIsCheckingRegistration(true);
    const { data, error } = await supabase
      .from("interest_registrations")
      .select("registration_type")
      .eq("user_id", user.id)
      .eq("registration_type", "participant")
      .maybeSingle();

    if (!error && data) {
      setHasParticipantRegistration(true);
    } else {
      setHasParticipantRegistration(false);
    }
    setIsCheckingRegistration(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to register your interest");
      return;
    }

    if (hasParticipantRegistration) {
      toast.error("You have already registered as a MIC Participant and cannot register as a Coach.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("interest_registrations").insert({
      user_id: user.id,
      user_email: user.email || "",
      roles: ["coach"],
      supervisor_email: supervisorEmail.trim() || null,
      registration_type: "coach",
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("You have already registered as a Coach.");
      } else {
        toast.error("Failed to register interest. Please try again.");
        console.error("Coach registration error:", error);
      }
      return;
    }

    setShowSuccess(true);
  };

  const handleClose = () => {
    setSupervisorEmail("");
    setShowSuccess(false);
    setHasParticipantRegistration(false);
    onOpenChange(false);
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <PartyPopper className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-center">Interest Registered!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your interest in becoming a MIC Coach! We've recorded your details and will be in
              touch soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleClose}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register as a MIC Coach</DialogTitle>
          <DialogDescription>
            By registering, you're expressing your commitment to guide and mentor product teams throughout their MIC journey.
          </DialogDescription>
        </DialogHeader>

        {isCheckingRegistration ? (
          <div className="py-4 text-center text-muted-foreground">Checking registration status...</div>
        ) : hasParticipantRegistration ? (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have already registered as a MIC Participant. You cannot register as both a Participant and a Coach.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coach-supervisor-email" className="text-sm font-medium">
                Direct Supervisor's CPF Email Address
              </Label>
              <Input
                id="coach-supervisor-email"
                type="email"
                placeholder="supervisor@cpf.gov.sg"
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
              />
            </div>

            <Alert className="bg-muted/50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Please inform your supervisor about your intention to participate as a MIC Coach.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!hasParticipantRegistration && !isCheckingRegistration && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm Interest"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
