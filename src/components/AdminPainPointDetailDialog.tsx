import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { X, Check, Archive } from 'lucide-react';

interface AdminPainPointDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  painPoint: {
    id: string;
    title: string;
    description: string | null;
    submitter_name: string;
    submitter_department: string | null;
    is_anonymous: boolean;
    status: string;
    created_at: string;
  } | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onArchive: (id: string) => void;
}

// Parse description to extract challenge and impact
const parseDescription = (desc: string | null) => {
  if (!desc) return { challenge: '', impact: '' };

  const text = desc.replace(/\r\n/g, '\n').trim();

  // Format A: markdown sections produced by our submission form
  // **Workplace Challenge:**\n...\n\n**Impact:**\n...
  const challengeMd = text.match(
    /\*\*Workplace Challenge:\*\*\s*\n([\s\S]*?)(?=\n\s*\n\*\*Impact:|$)/i
  );
  const impactMd = text.match(/\*\*Impact:\*\*\s*\n([\s\S]*?)$/i);

  // Format B: guided prompt-style dummy content
  // What's the current challenge? ...\n\nWhat are the operational/business implications? ...
  const challengePrompt = text.match(
    /What's the current challenge\?\s*([\s\S]*?)(?=\n\s*\nWho does it affect and how\?|\n\s*\nWhat are the operational\/business implications\?|$)/i
  );
  const impactPrompt = text.match(
    /What are the operational\/business implications\?\s*([\s\S]*?)(?=\n\s*\nWhat would success look like\?|$)/i
  );

  const challenge = (challengeMd?.[1] ?? challengePrompt?.[1] ?? text).trim();
  const impact = (impactMd?.[1] ?? impactPrompt?.[1] ?? '').trim();

  return { challenge, impact };
};

export function AdminPainPointDetailDialog({
  open,
  onOpenChange,
  painPoint,
  onApprove,
  onReject,
  onArchive
}: AdminPainPointDetailDialogProps) {
  if (!painPoint) return null;

  const displayName = painPoint.is_anonymous ? 'Anonymous' : painPoint.submitter_name;
  const { challenge, impact } = parseDescription(painPoint.description);

  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-8">{painPoint.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{displayName}</span>
            {!painPoint.is_anonymous && painPoint.submitter_department && (
              <>
                <span>•</span>
                <span>{painPoint.submitter_department}</span>
              </>
            )}
            <span>•</span>
            <span>{format(new Date(painPoint.created_at), 'dd MMM yyyy')}</span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-4 px-1">
            {/* Challenge */}
            {challenge && (
              <div>
                <h4 className="text-sm mb-1 font-bold text-sidebar-accent">Workplace Challenge</h4>
                <p className="text-foreground whitespace-pre-wrap">{challenge}</p>
              </div>
            )}
            
            {/* Impact */}
            {impact && (
              <div>
                <h4 className="text-sm mb-1 font-bold text-sidebar-accent">Impact of Problem</h4>
                <p className="text-foreground whitespace-pre-wrap">{impact}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action buttons based on status */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {painPoint.status === 'pending' && (
            <>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleAction(() => onReject(painPoint.id))}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button onClick={() => handleAction(() => onApprove(painPoint.id))}>
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </>
          )}
          
          {painPoint.status === 'approved' && (
            <>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleAction(() => onReject(painPoint.id))}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction(() => onArchive(painPoint.id))}
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
            </>
          )}
          
          {painPoint.status === 'archived' && (
            <Button
              variant="outline"
              onClick={() => handleAction(() => onApprove(painPoint.id))}
            >
              <Check className="h-4 w-4 mr-1" />
              Restore
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
