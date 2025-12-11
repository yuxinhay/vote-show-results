import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePainPoints } from '@/hooks/usePainPoints';
import { PainPointCard } from '@/components/PainPointCard';
import { SubmitPainPointDialog } from '@/components/SubmitPainPointDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { painPoints, isLoading, submitPainPoint, upvote } = usePainPoints();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

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
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <SubmitPainPointDialog onSubmit={submitPainPoint} />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
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
                  isAnonymous={pp.is_anonymous}
                  voteCount={pp.vote_count}
                  hasVoted={pp.has_voted}
                  commentCount={pp.comment_count}
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
