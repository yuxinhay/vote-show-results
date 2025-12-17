import { Gift, Sparkles } from 'lucide-react';
import govwalletLogo from '@/assets/govwallet-logo.png';

const Overview = () => {
  return (
    <div className="p-8 space-y-8">
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to MIC Pain Points</h1>
        <p className="text-muted-foreground mt-2">
          Share your workplace challenges and vote for issues that matter to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-2">Submit a Problem</h2>
          <p className="text-muted-foreground text-sm">
            Have a workplace issue? Submit it and let others vote on it. Your voice matters!
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-2">Vote & Support</h2>
          <p className="text-muted-foreground text-sm">
            Browse through submitted problems and upvote the ones you resonate with.
          </p>
        </div>
      </div>

      <footer className="text-center py-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Submissions close on <span className="font-semibold text-foreground">31 December 2025</span>. Winners will be announced in January 2026.
        </p>
      </footer>
    </div>
  );
};

export default Overview;
