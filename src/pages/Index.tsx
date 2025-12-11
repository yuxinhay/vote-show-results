import { usePainPoints } from '@/hooks/usePainPoints';
import { PainPointCard } from '@/components/PainPointCard';
import { SubmitPainPointDialog } from '@/components/SubmitPainPointDialog';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { painPoints, isLoading, submitPainPoint, upvote } = usePainPoints();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pain Points</h1>
            <p className="text-muted-foreground">
              Vote for problems you resonate with
            </p>
          </div>
          <SubmitPainPointDialog onSubmit={submitPainPoint} />
        </header>

        <section>
          <h2 className="text-lg font-semibold mb-4">
            Community Submissions ({painPoints.length})
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          ) : painPoints.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No pain points submitted yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {painPoints.map((pp) => (
                <PainPointCard
                  key={pp.id}
                  id={pp.id}
                  title={pp.title}
                  submitterName={pp.submitter_name}
                  submitterDepartment={pp.submitter_department}
                  voteCount={pp.vote_count}
                  hasVoted={pp.has_voted}
                  createdAt={pp.created_at}
                  onUpvote={upvote}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
