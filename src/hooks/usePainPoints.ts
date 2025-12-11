import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PainPoint {
  id: string;
  title: string;
  description: string | null;
  submitter_name: string;
  submitter_department: string | null;
  is_anonymous: boolean;
  created_at: string;
}

interface PainPointWithVotes extends PainPoint {
  vote_count: number;
  has_voted: boolean;
  comment_count: number;
}

const VOTED_PAIN_POINTS_KEY = 'voted_pain_points';

export function usePainPoints() {
  const [painPoints, setPainPoints] = useState<PainPointWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getVotedPainPoints = (): string[] => {
    return JSON.parse(localStorage.getItem(VOTED_PAIN_POINTS_KEY) || '[]');
  };

  const markAsVoted = (painPointId: string) => {
    const voted = getVotedPainPoints();
    voted.push(painPointId);
    localStorage.setItem(VOTED_PAIN_POINTS_KEY, JSON.stringify(voted));
  };

  const fetchPainPoints = async () => {
    const { data: painPointsData, error: painPointsError } = await supabase
      .from('pain_points')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (painPointsError) {
      console.error('Error fetching pain points:', painPointsError);
      return;
    }

    const { data: upvotesData, error: upvotesError } = await supabase
      .from('upvotes')
      .select('pain_point_id');

    if (upvotesError) {
      console.error('Error fetching upvotes:', upvotesError);
      return;
    }

    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('pain_point_id');

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }

    const voteCounts: Record<string, number> = {};
    upvotesData?.forEach(upvote => {
      voteCounts[upvote.pain_point_id] = (voteCounts[upvote.pain_point_id] || 0) + 1;
    });

    const commentCounts: Record<string, number> = {};
    commentsData?.forEach(comment => {
      commentCounts[comment.pain_point_id] = (commentCounts[comment.pain_point_id] || 0) + 1;
    });

    const votedIds = getVotedPainPoints();

    const painPointsWithVotes: PainPointWithVotes[] = (painPointsData || []).map(pp => ({
      ...pp,
      is_anonymous: pp.is_anonymous ?? false,
      vote_count: voteCounts[pp.id] || 0,
      has_voted: votedIds.includes(pp.id),
      comment_count: commentCounts[pp.id] || 0,
    }));

    setPainPoints(painPointsWithVotes);
  };

  const submitPainPoint = async (
    title: string, 
    isAnonymous?: boolean
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    const submitterName = user?.email || 'Unknown User';

    const { error } = await supabase
      .from('pain_points')
      .insert({
        title,
        submitter_name: submitterName,
        submitter_department: null,
        is_anonymous: isAnonymous || false,
        status: 'pending',
      });

    if (error) {
      console.error('Error submitting pain point:', error);
      return false;
    }

    return true;
  };

  const upvote = async (painPointId: string) => {
    const votedIds = getVotedPainPoints();
    if (votedIds.includes(painPointId)) return false;

    const { error } = await supabase
      .from('upvotes')
      .insert({ pain_point_id: painPointId });

    if (error) {
      console.error('Error upvoting:', error);
      return false;
    }

    markAsVoted(painPointId);
    
    setPainPoints(prev => prev.map(pp => 
      pp.id === painPointId 
        ? { ...pp, vote_count: pp.vote_count + 1, has_voted: true }
        : pp
    ));

    return true;
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchPainPoints();
      setIsLoading(false);
    };
    init();
  }, []);

  return {
    painPoints,
    isLoading,
    submitPainPoint,
    upvote,
    refetch: fetchPainPoints,
  };
}
