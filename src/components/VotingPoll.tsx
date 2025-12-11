import { useState } from 'react';
import { useVoting } from '@/hooks/useVoting';
import { PollResults } from './PollResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';

export function VotingPoll() {
  const {
    poll,
    options,
    voteCounts,
    hasVoted,
    isLoading,
    isSubmitting,
    submitVote,
    totalVotes,
  } = useVoting();

  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSubmit = () => {
    if (selectedOption) {
      submitVote(selectedOption);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No active poll available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-center">
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasVoted ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Thank you for voting!</span>
            </div>
            <PollResults voteCounts={voteCounts} totalVotes={totalVotes} />
          </div>
        ) : (
          <div className="space-y-6">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option.option_text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
