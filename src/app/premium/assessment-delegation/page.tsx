'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Users, Clock, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { useStrategicAccess } from '@/hooks/useStrategicAccess';
import { usePremiumUser } from '@/context/PremiumUserContext';
import { useRouter } from 'next/navigation';

interface AssessmentInvitation {
  id: string;
  invitee_email: string;
  invitee_name: string;
  assessment_type: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at: string | null;
  score: number | null;
}

interface TeamMember {
  id: string;
  member_email: string;
  member_name: string;
  role: string;
  created_at: string;
}

export default function AssessmentDelegationPage() {
  const router = useRouter();
  const { hasAccess, loading: accessLoading, error: accessError } = useStrategicAccess();
  const { user: premiumUser, isUserLoaded } = usePremiumUser();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<AssessmentInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('employee');

  useEffect(() => {
    // Check if user has Strategic access and is loaded
    if (!accessLoading && isUserLoaded) {
      if (!hasAccess) {
        console.log('User does not have Strategic access, redirecting...');
        router.push('/premium/dashboard');
        return;
      }
      
      if (!premiumUser) {
        console.log('No authenticated user found');
        setLoading(false);
        return;
      }
      
      console.log('User authenticated via PremiumUserContext:', premiumUser.id);
      loadData();
    }
  }, [hasAccess, accessLoading, isUserLoaded, premiumUser, router]);

  const loadData = async () => {
    if (!premiumUser?.id) return;
    
    try {
      setLoading(true);
      
      // Load team members
      const teamResponse = await fetch('/api/assessment-delegation/get-team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id: premiumUser.id }),
      });

      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamMembers(teamData.teamMembers || []);
      }

      // Load invitations
      const invitationsResponse = await fetch('/api/assessment-delegation/get-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id: premiumUser.id }),
      });

      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData.invitations || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async () => {
    try {
      setSending(true);
      
      if (!premiumUser?.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/assessment-delegation/add-team-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u_id: premiumUser.id,
          memberEmail,
          memberName,
          memberRole
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add team member');
      }

      // Reset form
      setMemberEmail('');
      setMemberName('');
      setMemberRole('employee');
      setShowTeamForm(false);

      // Reload data
      await loadData();

    } catch (error: any) {
      alert('Error adding team member: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const removeTeamMember = async (memberId: string) => {
    try {
      if (!premiumUser?.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/assessment-delegation/remove-team-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u_id: premiumUser.id,
          memberId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove team member');
      }

      await loadData();
    } catch (error: any) {
      alert('Error removing team member: ' + error.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      default:
        return 'Pending';
    }
  };

  if (accessLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            Assessment delegation is only available with the Strategic plan.
          </p>
          <button
            onClick={() => router.push('/premium/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Delegation</h1>
          <p className="text-gray-600">
            Invite team members to complete assessments and delegate specific questions to get comprehensive insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Members Section */}
          <Card>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </h2>
                <Button
                  onClick={() => setShowTeamForm(!showTeamForm)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </div>
            <CardContent>
              {showTeamForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="memberName">Name</Label>
                      <Input
                        id="memberName"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Enter member name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberEmail">Email</Label>
                      <Input
                        id="memberEmail"
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Enter member email"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="memberRole">Role</Label>
                    <select
                      id="memberRole"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="vp_sales">VP Sales</option>
                      <option value="vp_marketing">VP Marketing</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={addTeamMember}
                      disabled={sending || !memberName || !memberEmail}
                      className="px-3 py-1.5 text-sm"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        'Add Member'
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowTeamForm(false)}
                      className="px-3 py-1.5 text-sm bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{member.member_name}</p>
                      <p className="text-sm text-gray-600">{member.member_email}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                        {member.role.replace('_', ' ')}
                      </span>
                    </div>
                    <Button
                      onClick={() => removeTeamMember(member.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 border-2 border-red-300 text-red-700 hover:bg-red-200 hover:border-red-400 font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No team members added yet. Add your first team member to get started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invitations Tracking Section */}
          <Card>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Sent Invitations
                </h2>
                <span className="text-sm text-gray-500">
                  {invitations.filter(inv => inv.status === 'pending').length} pending
                </span>
              </div>
            </div>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{invitation.invitee_name}</p>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            {getStatusIcon(invitation.status)}
                            {getStatusText(invitation.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{invitation.invitee_email}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {invitation.assessment_type.replace('_', ' ')}
                          </span>
                          {invitation.score && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              Score: {invitation.score}
                            </span>
                          )}
                          <span className="text-gray-500">
                            Sent: {new Date(invitation.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {invitations.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No invitations sent yet. Use the assessment cards to invite team members.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 