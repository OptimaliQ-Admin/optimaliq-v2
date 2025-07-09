'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  RefreshCw,
  Target,
  Filter,
  Search,
  Building2,
  Briefcase,
  Crown,
  UserCheck,
  UserX,
  Clock3,
  BarChart3,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { useStrategicAccess } from '@/hooks/useStrategicAccess';
import { usePremiumUser } from '@/context/PremiumUserContext';
import { useRouter } from 'next/navigation';
import { format, differenceInDays, subDays, startOfDay, endOfDay } from 'date-fns';
import StrategicPulseCard from '@/components/dashboard/StrategicPulseCard';
import PulseResultsCard from '@/components/dashboard/PulseResultsCard';

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
  department: string;
  created_at: string;
}

const DEPARTMENTS = [
  { value: 'executive', label: 'Executive', icon: Crown },
  { value: 'sales', label: 'Sales', icon: TrendingUp },
  { value: 'marketing', label: 'Marketing', icon: Target },
  { value: 'engineering', label: 'Engineering', icon: Settings },
  { value: 'product', label: 'Product', icon: Briefcase },
  { value: 'operations', label: 'Operations', icon: Building2 },
  { value: 'customer_success', label: 'Customer Success', icon: UserCheck },
  { value: 'finance', label: 'Finance', icon: BarChart3 },
  { value: 'hr', label: 'Human Resources', icon: Users },
  { value: 'legal', label: 'Legal', icon: AlertTriangle },
  { value: 'it', label: 'IT', icon: Settings },
  { value: 'research', label: 'Research', icon: Search },
  { value: 'other', label: 'Other', icon: MoreHorizontal }
];

const ROLES = [
  // Executive
  { value: 'ceo', label: 'CEO', department: 'executive' },
  { value: 'cto', label: 'CTO', department: 'executive' },
  { value: 'cfo', label: 'CFO', department: 'executive' },
  { value: 'coo', label: 'COO', department: 'executive' },
  
  // VP Level
  { value: 'vp_sales', label: 'VP Sales', department: 'sales' },
  { value: 'vp_marketing', label: 'VP Marketing', department: 'marketing' },
  { value: 'vp_engineering', label: 'VP Engineering', department: 'engineering' },
  { value: 'vp_product', label: 'VP Product', department: 'product' },
  { value: 'vp_operations', label: 'VP Operations', department: 'operations' },
  { value: 'vp_customer_success', label: 'VP Customer Success', department: 'customer_success' },
  
  // Director Level
  { value: 'director_sales', label: 'Director of Sales', department: 'sales' },
  { value: 'director_marketing', label: 'Director of Marketing', department: 'marketing' },
  { value: 'director_engineering', label: 'Director of Engineering', department: 'engineering' },
  { value: 'director_product', label: 'Director of Product', department: 'product' },
  { value: 'director_operations', label: 'Director of Operations', department: 'operations' },
  
  // Management Level
  { value: 'senior_manager', label: 'Senior Manager', department: 'other' },
  { value: 'manager', label: 'Manager', department: 'other' },
  { value: 'team_lead', label: 'Team Lead', department: 'other' },
  
  // Individual Contributors
  { value: 'senior_analyst', label: 'Senior Analyst', department: 'other' },
  { value: 'analyst', label: 'Analyst', department: 'other' },
  { value: 'specialist', label: 'Specialist', department: 'other' },
  { value: 'senior_engineer', label: 'Senior Engineer', department: 'engineering' },
  { value: 'engineer', label: 'Engineer', department: 'engineering' },
  { value: 'developer', label: 'Developer', department: 'engineering' },
  { value: 'employee', label: 'Employee', department: 'other' },
  { value: 'intern', label: 'Intern', department: 'other' }
];

export default function AssessmentDelegationPage() {
  const router = useRouter();
  const { hasAccess, loading: accessLoading, error: accessError } = useStrategicAccess();
  const { user: premiumUser, isUserLoaded } = usePremiumUser();
  
  // State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<AssessmentInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Team Member Form
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('employee');
  const [memberDepartment, setMemberDepartment] = useState('other');
  
  // Filters
  const [invitationFilter, setInvitationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
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
          memberRole,
          memberDepartment
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
      setMemberDepartment('other');
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

  // Filtered and processed data
  const filteredInvitations = useMemo(() => {
    let filtered = invitations;

    // Status filter
    if (invitationFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === invitationFilter);
    }

    // Time filter
    if (invitationFilter === 'recent') {
      const sevenDaysAgo = subDays(new Date(), 7);
      filtered = filtered.filter(inv => new Date(inv.created_at) >= sevenDaysAgo);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.invitee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invitee_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Return latest 6
    return filtered.slice(0, 6);
  }, [invitations, invitationFilter, searchTerm]);

  const filteredTeamMembers = useMemo(() => {
    let filtered = teamMembers;

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(member => member.department === departmentFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.member_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [teamMembers, departmentFilter, searchTerm]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'pending':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
      case 'expired':
        return { text: 'Expired', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertTriangle };
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleInfo = ROLES.find(r => r.value === role);
    return roleInfo ? roleInfo.label : role;
  };

  const getDepartmentDisplay = (department: string) => {
    const deptInfo = DEPARTMENTS.find(d => d.value === department);
    return deptInfo ? deptInfo.label : department;
  };

  const getAssessmentTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'sales': 'Sales Assessment',
      'bpm': 'Business Process',
      'tech_stack': 'Tech Stack',
      'strategic_maturity': 'Strategic Maturity',
      'marketing_effectiveness': 'Marketing Effectiveness',
      'ai_readiness': 'AI Readiness',
      'competitive_benchmarking': 'Competitive Benchmark',
      'customer_experience': 'Customer Experience',
      'digital_transformation': 'Digital Transformation',
      'leadership': 'Leadership Assessment'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading Team Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Dashboard</h1>
              <p className="text-gray-600 mt-1">Strategic pulse checks and team management</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Strategic Pulse Section */}
        {premiumUser && (
          <div className="mb-8">
            <PulseResultsCard user={premiumUser} />
          </div>
        )}

        <div className="mb-8">
          <StrategicPulseCard user={premiumUser} teamMembers={teamMembers} />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members ({teamMembers.length})
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Sent Invitations ({invitations.length})
            </TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white shadow-sm border-0">
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
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add Team Member Form */}
                {showTeamForm && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                      <div>
                        <Label htmlFor="memberDepartment" className="text-sm font-medium">Department</Label>
                        <Select value={memberDepartment} onValueChange={setMemberDepartment}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="memberRole" className="text-sm font-medium">Role</Label>
                        <Select value={memberRole} onValueChange={setMemberRole}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.filter(role => role.department === memberDepartment || memberDepartment === 'other').map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={addTeamMember}
                        disabled={sending || !memberName || !memberEmail}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
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

                {/* Team Members List */}
                <div className="space-y-3">
                  {filteredTeamMembers.map((member) => {
                    const deptInfo = DEPARTMENTS.find(d => d.value === member.department);
                    const DeptIcon = deptInfo?.icon || Building2;
                    
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-700">
                              {member.member_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.member_name}</p>
                            <p className="text-sm text-gray-600">{member.member_email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <DeptIcon className="h-3 w-3 mr-1" />
                                {getDepartmentDisplay(member.department)}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {getRoleDisplay(member.role)}
                              </Badge>
                            </div>
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
                    );
                  })}
                  {filteredTeamMembers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No team members found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm || departmentFilter !== 'all' 
                          ? 'Try adjusting your search or filters' 
                          : 'Add your first team member to start delegating assessments'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <Card className="bg-white shadow-sm border-0">
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
                  <Badge variant="outline" className="text-sm bg-purple-50 text-purple-700 border-purple-200">
                    {invitations.filter(inv => inv.status === 'pending').length} pending
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search invitations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={invitationFilter} onValueChange={setInvitationFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Invitations</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="recent">Last 7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Invitations List */}
                <div className="space-y-3">
                  {filteredInvitations.map((invitation) => {
                    const statusInfo = getStatusInfo(invitation.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div
                        key={invitation.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold text-gray-900">{invitation.invitee_name}</p>
                              <Badge className={`text-xs ${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.text}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{invitation.invitee_email}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
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
                  {filteredInvitations.length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No invitations found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm || invitationFilter !== 'all' 
                          ? 'Try adjusting your search or filters' 
                          : 'Create your first pulse check to see invitations here'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 