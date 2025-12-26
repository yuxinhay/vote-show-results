import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, ArrowLeft, User, Users, Download } from 'lucide-react';
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

interface InterestRegistration {
  id: string;
  user_email: string;
  roles: string[];
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  product_sponsor: 'Product Sponsor',
  hustler: 'Hustler (PM)',
  hipster: 'Hipster (Designer)',
  hacker: 'Hacker (Developer)',
};

const downloadCSV = (registrations: InterestRegistration[]) => {
  const headers = ['Email', 'Roles', 'Registered At'];
  const rows = registrations.map(reg => [
    reg.user_email,
    reg.roles.map(r => ROLE_LABELS[r] || r).join('; '),
    format(new Date(reg.created_at), 'dd MMM yyyy, HH:mm')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `interest-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const Admin = () => {
  const navigate = useNavigate();
  const [painPoints, setPainPoints] = useState<PendingPainPoint[]>([]);
  const [interestRegistrations, setInterestRegistrations] = useState<InterestRegistration[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    fetchPainPoints();
    fetchInterestRegistrations();
  }, []);

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

  const fetchInterestRegistrations = async () => {
    const { data, error } = await supabase
      .from('interest_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interest registrations:', error);
      return;
    }

    setInterestRegistrations(data || []);
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

  // Show loading while data is being fetched
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const pendingItems = painPoints.filter(pp => pp.status === 'pending');
  const approvedItems = painPoints.filter(pp => pp.status === 'approved');
  const rejectedItems = painPoints.filter(pp => pp.status === 'rejected');
  const archivedItems = painPoints.filter(pp => pp.status === 'archived');

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

        <Tabs defaultValue="pain-points" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pain-points">Problem Statements</TabsTrigger>
            <TabsTrigger value="interests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Interest Registrations
              <Badge variant="secondary" className="ml-1">{interestRegistrations.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pain-points" className="space-y-8 mt-6">
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
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium">{pp.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {pp.is_anonymous ? 'Anonymous' : pp.submitter_name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
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
                              variant="outline"
                              onClick={async () => {
                                const { error } = await supabase
                                  .from('pain_points')
                                  .update({ status: 'archived' })
                                  .eq('id', pp.id);
                                if (error) {
                                  toast.error('Failed to archive');
                                } else {
                                  toast.success('Archived');
                                  fetchPainPoints();
                                }
                              }}
                            >
                              Archive
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

            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Archived
                <Badge variant="secondary">{archivedItems.length}</Badge>
              </h2>
              
              {archivedItems.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No archived items</p>
              ) : (
                <div className="space-y-2">
                  {archivedItems.map((pp) => (
                    <Card key={pp.id} className="bg-muted/50 opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{pp.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {pp.is_anonymous ? 'Anonymous' : pp.submitter_name}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(pp.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="interests" className="mt-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Registered Interest Parties</h2>
                {interestRegistrations.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCSV(interestRegistrations)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                )}
              </div>
              
              {interestRegistrations.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No interest registrations yet</p>
              ) : (
                <div className="space-y-4">
                  {interestRegistrations.map((reg) => (
                    <Card key={reg.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">
                              {format(new Date(reg.created_at), 'dd MMM yyyy, HH:mm')}
                            </p>
                            <p className="font-medium mb-2">{reg.user_email}</p>
                            <div className="flex flex-wrap gap-2">
                              {reg.roles.map((role) => (
                                <Badge key={role} variant="secondary">
                                  {ROLE_LABELS[role] || role}
                                </Badge>
                              ))}
                            </div>
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
