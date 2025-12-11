import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PollOption {
  id: string;
  option_text: string;
  poll_id: string;
}

interface Poll {
  id: string;
  question: string;
}

interface VoteCount {
  option_id: string;
  option_text: string;
  count: number;
}

const VOTED_POLLS_KEY = 'voted_polls';

export function useVoting() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkIfVoted = (pollId: string): boolean => {
    const votedPolls = JSON.parse(localStorage.getItem(VOTED_POLLS_KEY) || '[]');
    return votedPolls.includes(pollId);
  };

  const markAsVoted = (pollId: string) => {
    const votedPolls = JSON.parse(localStorage.getItem(VOTED_POLLS_KEY) || '[]');
    votedPolls.push(pollId);
    localStorage.setItem(VOTED_POLLS_KEY, JSON.stringify(votedPolls));
  };

  const fetchPoll = async () => {
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (pollError) {
      console.error('Error fetching poll:', pollError);
      return;
    }

    if (pollData) {
      setPoll(pollData);
      setHasVoted(checkIfVoted(pollData.id));

      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', pollData.id);

      if (optionsError) {
        console.error('Error fetching options:', optionsError);
        return;
      }

      setOptions(optionsData || []);
    }
  };

  const fetchVoteCounts = async () => {
    if (!poll) return;

    const { data: votes, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', poll.id);

    if (error) {
      console.error('Error fetching votes:', error);
      return;
    }

    const counts: Record<string, number> = {};
    options.forEach(opt => {
      counts[opt.id] = 0;
    });

    votes?.forEach(vote => {
      if (counts[vote.option_id] !== undefined) {
        counts[vote.option_id]++;
      }
    });

    const voteCountsArray: VoteCount[] = options.map(opt => ({
      option_id: opt.id,
      option_text: opt.option_text,
      count: counts[opt.id] || 0,
    }));

    setVoteCounts(voteCountsArray);
  };

  const submitVote = async (optionId: string) => {
    if (!poll || hasVoted) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('votes')
      .insert({ poll_id: poll.id, option_id: optionId });

    if (error) {
      console.error('Error submitting vote:', error);
      setIsSubmitting(false);
      return;
    }

    markAsVoted(poll.id);
    setHasVoted(true);
    await fetchVoteCounts();
    setIsSubmitting(false);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchPoll();
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (poll && hasVoted) {
      fetchVoteCounts();
    }
  }, [poll, hasVoted, options]);

  const totalVotes = voteCounts.reduce((sum, vc) => sum + vc.count, 0);

  return {
    poll,
    options,
    voteCounts,
    hasVoted,
    isLoading,
    isSubmitting,
    submitVote,
    totalVotes,
  };
}
