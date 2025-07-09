'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Send, 
  Users, 
  Target, 
  Plus, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';
import { showToast } from '@/lib/utils/toast';

interface PulseQuestion {
  id: string;
  text: string;
  type: 'scale_1_5' | 'text';
}

interface PulseData {
  id: string;
  title: string;
  department: string;
  areas_of_focus: string[];
  questions: PulseQuestion[];
}

interface DelegationData {
  id: string;
  delegateEmail: string;
  delegateName: string;
  status: string;
  expiresAt: string;
}

interface TeamMember {
  name: string;
  email: string;
  answers: Record<string, string | number>;
}

export default function PulseDelegatePage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [delegation, setDelegation] = useState<DelegationData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const loadDelegationData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/strategic-pulse/delegate/${token}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load delegation data');
      }

      const data = await response.json();
      setPulse(data.pulse);
      setDelegation(data.delegation);
      
    } catch (error) {
      console.error('Error loading delegation data:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to load delegation data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDelegationData();
  }, [loadDelegationData]);

  const addTeamMember = () => {
    if (!newMemberName || !newMemberEmail) {
      showToast.error('Please fill in both name and email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      showToast.error('Please enter a valid email address');
      return;
    }

    // Check if email already exists
    if (teamMembers.some(member => member.email.toLowerCase() === newMemberEmail.toLowerCase())) {
      showToast.error('This email is already added to the team');
      return;
    }

    const newMember: TeamMember = {
      name: newMemberName,
      email: newMemberEmail,
      answers: {}
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddForm(false);
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member.email !== email));
  };

  const submitDelegation = async () => {
    if (teamMembers.length === 0) {
      showToast.error('Please add at least one team member');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/strategic-pulse/delegate/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamMembers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit delegation');
      }

      showToast.success('Team members assigned successfully!');
      
      // Show success state
      setTimeout(() => {
        window.location.href = '/pulse/delegate/thank-you';
      }, 2000);

    } catch (error) {
      console.error('Error submitting delegation:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to submit delegation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading pulse check...</p>
        </div>
      </div>
    );
  }

  if (!pulse || !delegation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid or Expired Link</h2>
          <p className="text-gray-600">
            This delegation link is invalid or has expired. Please contact the person who sent you this link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategic Pulse Check</h1>
                          <p className="text-gray-600 max-w-2xl mx-auto">
                You&apos;ve been assigned to manage a pulse check for your team. Review the questions below and assign them to your team members.
              </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pulse Questions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{pulse.title}</h2>
                  <p className="text-sm text-gray-600">Review the questions for your team</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pulse.questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Q{index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                        <Badge variant="secondary" className="text-xs">
                          {question.type === 'scale_1_5' ? 'Scale (1-5)' : 'Text Response'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Assignment */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Team Assignment</h2>
                    <p className="text-sm text-gray-600">Assign questions to your team</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Add Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="memberName" className="text-sm font-medium">Name</Label>
                      <Input
                        id="memberName"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="Enter member name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberEmail" className="text-sm font-medium">Email</Label>
                      <Input
                        id="memberEmail"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Enter member email"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={addTeamMember}
                      disabled={!newMemberName || !newMemberEmail}
                      size="sm"
                    >
                      Add Member
                    </Button>
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {teamMembers.map((member, _index) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeTeamMember(member.email)}
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
                    <p className="text-sm text-gray-400">Add your team members to assign the pulse check</p>
                  </div>
                )}
              </div>

              {teamMembers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={submitDelegation}
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 h-4 mr-2" />
                        Assign to {teamMembers.length} Team Member{teamMembers.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 