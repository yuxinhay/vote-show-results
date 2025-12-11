import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePainPoints } from '@/hooks/usePainPoints';
import { PainPointCard } from '@/components/PainPointCard';
import { SubmitPainPointDialog } from '@/components/SubmitPainPointDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Settings, Gift, Sparkles } from 'lucide-react';
import govwalletLogo from '@/assets/govwallet-logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { painPoints, isLoading, submitPainPoint, upvote } = usePainPoints();

  // TEMP: Auth disabled for development preview
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     navigate('/auth');
  //   }
  // }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // TEMP: Loading check disabled for development preview
  // if (authLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <p className="text-muted-foreground">Loading...</p>
  //     </div>
  //   );
  // }

  // TEMP: User check disabled for development preview
  // if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Incentive Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 p-4 shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 animate-pulse" />
              <span className="text-lg font-bold">Win $10</span>
            </div>
            <img src={govwalletLogo} alt="GovWallet" className="h-8 bg-white rounded px-2 py-1" />
            <p className="text-center md:text-left font-medium">
              Submit your problem statement or upvote to stand a chance to win!
            </p>
            <Gift className="h-6 w-6 hidden md:block" />
          </div>
        </div>

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

        {/* Submission Deadline Notice */}
        <footer className="text-center py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Submissions close on <span className="font-semibold text-foreground">31 December 2025</span>. Winners will be announced in January 2026.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
