'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Send, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  Mail,
  Calendar,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { useStrategicAccess } from '@/hooks/useStrategicAccess';
import { usePremiumUser } from '@/context/PremiumUserContext';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';

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
  const [refreshing, setRefreshing] = useState(false);

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
      
      console.log('User authenticated via PremiumUserContext:', premiumUser.u_id);
      loadData();
    }
  }, [hasAccess, accessLoading, isUserLoaded, premiumUser, router]);

  const loadData = async () => {
    if (!premiumUser?.u_id) return;
    
    try {
      setLoading(true);
      
      // Load team members
      const teamResponse = await fetch('/api/assessment-delegation/get-team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id: premiumUser.u_id }),
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
        body: JSON.stringify({ u_id: premiumUser.u_id }),
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

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const addTeamMember = async () => {
    try {
      setSending(true);
      
      if (!premiumUser?.u_id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/assessment-delegation/add-team-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u_id: premiumUser.u_id,
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
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      if (!premiumUser?.u_id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/assessment-delegation/remove-team-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u_id: premiumUser.u_id,
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Completed'
        };
      case 'expired':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Expired'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pending'
        };
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'employee': 'Employee',
      'manager': 'Manager',
      'vp_sales': 'VP Sales',
      'vp_marketing': 'VP Marketing'
    };
    return roleMap[role] || role.replace('_', ' ');
  };

  const getAssessmentTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'bpm': 'Business Process Management',
      'sales': 'Sales Effectiveness',
      'tech_stack': 'Technology Stack',
      'strategic_maturity': 'Strategic Maturity',
      'marketing_effectiveness': 'Marketing Effectiveness',
      'ai_readiness': 'AI Readiness',
      'competitive_benchmarking': 'Competitive Benchmarking',
      'customer_experience': 'Customer Experience',
      'digital_transformation': 'Digital Transformation',
      'leadership': 'Leadership'
    };
    return typeMap[type] || type.replace('_', ' ');
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const completedInvitations = invitations.filter(inv => inv.status === 'completed');
  const expiredInvitations = invitations.filter(inv => inv.status === 'expired');

  if (accessLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading assessment delegation...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Assessment delegation is only available with the Strategic plan. Upgrade your subscription to access team collaboration features.
          </p>
          <Button
            onClick={() => router.push('/premium/dashboard')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Delegation</h1>
              <p className="text-gray-600 max-w-2xl">
                Invite team members to complete assessments and delegate specific questions to get comprehensive insights across your organization.
              </p>
            </div>
            <Button
              onClick={refreshData}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingInvitations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedInvitations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{expiredInvitations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Members Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                    <p className="text-sm text-gray-600">Manage your assessment team</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowTeamForm(!showTeamForm)}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showTeamForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="memberName" className="text-sm font-medium">Name</Label>
                      <Input
                        id="memberName"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Enter member name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberEmail" className="text-sm font-medium">Email</Label>
                      <Input
                        id="memberEmail"
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Enter member email"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="memberRole" className="text-sm font-medium">Role</Label>
                    <select
                      id="memberRole"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      size="sm"
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
                      variant="outline"
                      size="sm"
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
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {member.member_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.member_name}</p>
                        <p className="text-sm text-gray-600">{member.member_email}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {getRoleDisplay(member.role)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeTeamMember(member.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No team members added yet</p>
                    <p className="text-sm text-gray-400">Add your first team member to start delegating assessments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invitations Tracking Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Sent Invitations</h2>
                    <p className="text-sm text-gray-600">Track assessment invitations</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {pendingInvitations.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation) => {
                  const statusInfo = getStatusInfo(invitation.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div
                      key={invitation.id}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-gray-900">{invitation.invitee_name}</p>
                            <Badge className={`text-xs ${statusInfo.color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.text}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{invitation.invitee_email}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {getAssessmentTypeDisplay(invitation.assessment_type)}
                            </Badge>
                            {invitation.score && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Score: {invitation.score.toFixed(1)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Sent: {format(new Date(invitation.created_at), "MMM d, yyyy")}
                            </div>
                            {invitation.completed_at && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Completed: {format(new Date(invitation.completed_at), "MMM d, yyyy")}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {invitations.length === 0 && (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No invitations sent yet</p>
                    <p className="text-sm text-gray-400">Use the assessment cards to invite team members</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 