import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PendingPainPoint {
  id: string;
  title: string;
  submitter_name: string;
  submitter_department: string | null;
  is_anonymous: boolean;
  status: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [painPoints, setPainPoints] = useState<PendingPainPoint[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPainPoints();
    }
  }, [isAdmin]);

  const fetchPainPoints = async () => {
    const { data, error } = await supabase
      .from('pain_points')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pain points:', error);
      return;
    }

    setPainPoints(data || []);
    setIsLoadingData(false);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('pain_points')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      toast.error('Failed to approve');
      return;
    }

    toast.success('Pain point approved');
    fetchPainPoints();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('pain_points')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast.error('Failed to reject');
      return;
    }

    toast.success('Pain point rejected');
    fetchPainPoints();
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const pendingItems = painPoints.filter(pp => pp.status === 'pending');
  const approvedItems = painPoints.filter(pp => pp.status === 'approved');
  const rejectedItems = painPoints.filter(pp => pp.status === 'rejected');

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Review and approve submissions</p>
          </div>
        </header>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Pending Approval
            <Badge variant="secondary">{pendingItems.length}</Badge>
          </h2>
          
          {isLoadingData ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : pendingItems.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No pending submissions</p>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((pp) => (
                <Card key={pp.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          {format(new Date(pp.created_at), 'dd MMM yyyy, HH:mm')}
                        </p>
                        <p className="font-medium mb-2">{pp.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {pp.is_anonymous ? (
                            <span className="italic">Anonymous</span>
                          ) : (
                            <span>
                              {pp.submitter_name}
                              {pp.submitter_department && ` • ${pp.submitter_department}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleReject(pp.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(pp.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Approved
            <Badge variant="secondary">{approvedItems.length}</Badge>
          </h2>
          
          {approvedItems.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No approved items</p>
          ) : (
            <div className="space-y-2">
              {approvedItems.map((pp) => (
                <Card key={pp.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{pp.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {pp.is_anonymous ? 'Anonymous' : pp.submitter_name}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-primary">Approved</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Rejected
            <Badge variant="secondary">{rejectedItems.length}</Badge>
          </h2>
          
          {rejectedItems.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No rejected items</p>
          ) : (
            <div className="space-y-2">
              {rejectedItems.map((pp) => (
                <Card key={pp.id} className="bg-destructive/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{pp.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {pp.is_anonymous ? 'Anonymous' : pp.submitter_name}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-destructive">Rejected</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
