import { VotingPoll } from '@/components/VotingPoll';

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Community Poll</h1>
          <p className="text-muted-foreground">
            Cast your vote and see what others think
          </p>
        </header>
        <VotingPoll />
      </div>
    </div>
  );
};

export default Index;
