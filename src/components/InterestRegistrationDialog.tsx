import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, PartyPopper } from 'lucide-react';
interface InterestRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const ROLES = [{
  id: 'product_sponsor',
  label: 'Product Sponsor'
}, {
  id: 'hustler',
  label: 'Hustler (Product Manager)'
}, {
  id: 'hipster',
  label: 'Hipster (Designer)'
}, {
  id: 'hacker',
  label: 'Hacker (Developer)'
}];
export function InterestRegistrationDialog({
  open,
  onOpenChange
}: InterestRegistrationDialogProps) {
  const {
    user
  } = useAuth();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]);
  };
  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to register your interest');
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }
    setIsSubmitting(true);
    const {
      error
    } = await supabase.from('interest_registrations').insert({
      user_id: user.id,
      user_email: user.email || '',
      roles: selectedRoles
    });
    setIsSubmitting(false);
    if (error) {
      toast.error('Failed to register interest. Please try again.');
      console.error('Interest registration error:', error);
      return;
    }
    setShowSuccess(true);
  };
  const handleClose = () => {
    setSelectedRoles([]);
    setShowSuccess(false);
    onOpenChange(false);
  };
  if (showSuccess) {
    return <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <PartyPopper className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-center">Interest Registered!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your interest in joining the MIC Programme! We've recorded your preferences and will be in touch soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleClose}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  }
  return <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register Your Interest</DialogTitle>
          <DialogDescription>
            Select the role(s) you're interested in for the MIC Programme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Which role(s) are you interested in?</Label>
            {ROLES.map(role => <div key={role.id} className="flex items-center space-x-3">
                <Checkbox id={role.id} checked={selectedRoles.includes(role.id)} onCheckedChange={() => handleRoleToggle(role.id)} />
                <Label htmlFor={role.id} className="cursor-pointer font-normal">
                  {role.label}
                </Label>
              </div>)}
          </div>

          <Alert className="bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              By registering your interest, you acknowledge that participation in the MIC Programme requires a significant time commitment across 10 weeks, and you have informed your supervisor about your intention to participate. If you select multiple roles, your final role assignment will be subject to our decision.
            </AlertDescription>
          </Alert>

          
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || selectedRoles.length === 0}>
            {isSubmitting ? 'Submitting...' : 'Submit Interest'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}