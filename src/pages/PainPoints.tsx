import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePainPoints } from '@/hooks/usePainPoints';
import { PainPointCard } from '@/components/PainPointCard';
import { SubmitPainPointDialog } from '@/components/SubmitPainPointDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Settings, Sparkles, Gift } from 'lucide-react';
import govwalletLogo from '@/assets/govwallet-logo.png';
const PainPoints = () => {
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const {
    painPoints,
    isLoading,
    submitPainPoint,
    upvote
  } = usePainPoints();
  return <div className="p-8 space-y-8">
      {/* Incentive Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 p-6 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative flex flex-col items-center text-center text-white space-y-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 animate-pulse" />
            <img src={govwalletLogo} alt="GovWallet" className="h-8 bg-white rounded px-2 py-1" />
            <Gift className="h-6 w-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            Win $30 GovWallet voucher when your problem statement is selected for MIC Season 5!
          </h2>
          <p className="text-sm opacity-90">
            Submission will close in XXX 2026, and winners will be announced in XXX 2026.
          </p>
        </div>
      </div>


      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pain Points</h1>
          <p className="text-secondary">
            Vote for problems you resonate with
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>}
          <SubmitPainPointDialog onSubmit={submitPainPoint} />
        </div>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Community Submissions ({painPoints.length})
        </h2>

        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
          </div> : painPoints.length === 0 ? <div className="text-center py-16 text-muted-foreground">
            <p>No pain points submitted yet. Be the first!</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPoints.map(pp => <PainPointCard key={pp.id} id={pp.id} title={pp.title} description={pp.description} submitterName={pp.submitter_name} submitterDepartment={pp.submitter_department} isAnonymous={pp.is_anonymous} voteCount={pp.vote_count} hasVoted={pp.has_voted} commentCount={pp.comment_count} createdAt={pp.created_at} onUpvote={upvote} />)}
          </div>}
      </section>
    </div>;
};
export default PainPoints;