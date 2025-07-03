'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Users, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QuestionDelegationCardProps {
  assessmentType: string;
  questions: Array<{
    key: string;
    label: string;
    type: string;
  }>;
  teamMembers: Array<{
    id: string;
    member_email: string;
    member_name: string;
    role: string;
  }>;
}

export default function QuestionDelegationCard({ 
  assessmentType, 
  questions, 
  teamMembers 
}: QuestionDelegationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, boolean>>({});
  const [selectedMember, setSelectedMember] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleQuestionToggle = (questionKey: string) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = questions.every(q => selectedQuestions[q.key]);
    const newSelection: Record<string, boolean> = {};
    questions.forEach(q => {
      newSelection[q.key] = !allSelected;
    });
    setSelectedQuestions(newSelection);
  };

  const handleSendDelegation = async () => {
    if (!selectedMember) {
      alert('Please select a team member');
      return;
    }

    const selectedQuestionKeys = Object.keys(selectedQuestions).filter(key => selectedQuestions[key]);
    if (selectedQuestionKeys.length === 0) {
      alert('Please select at least one question to delegate');
      return;
    }

    const member = teamMembers.find(m => m.id === selectedMember);
    if (!member) return;

    try {
      setSending(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('/api/assessment-delegation/send-delegation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          delegateEmail: member.member_email,
          delegateName: member.member_name,
          assessmentType,
          questionKeys: selectedQuestionKeys,
          customMessage
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send delegation');
      }

      // Reset form
      setSelectedQuestions({});
      setSelectedMember('');
      setCustomMessage('');
      setExpanded(false);

      alert('Delegation sent successfully!');

    } catch (error: any) {
      alert('Error sending delegation: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const selectedCount = Object.values(selectedQuestions).filter(Boolean).length;
  const allSelected = questions.length > 0 && questions.every(q => selectedQuestions[q.key]);

  return (
    <Card className="mb-6">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Delegate Questions</h3>
              <p className="text-sm text-gray-600">
                Assign specific questions to team members for completion
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {expanded && (
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Team Member Selection */}
            <div>
              <Label htmlFor="teamMember">Select Team Member</Label>
              <select
                id="teamMember"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              >
                <option value="">Choose a team member...</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.member_name} ({member.member_email}) - {member.role.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {teamMembers.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No team members available. Add team members in the Assessment Delegation section.
                </p>
              )}
            </div>

            {/* Question Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Select Questions to Delegate</Label>
                <Button
                  onClick={handleSelectAll}
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {questions.map((question) => (
                  <div
                    key={question.key}
                    className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleQuestionToggle(question.key)}
                  >
                    <div className="mt-0.5">
                      {selectedQuestions[question.key] ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{question.label}</p>
                      <p className="text-xs text-gray-500 capitalize">{question.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCount > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedCount} question{selectedCount !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Custom Message */}
            <div>
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal message for the team member..."
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSendDelegation}
                disabled={sending || !selectedMember || selectedCount === 0}
                className="flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Delegation ({selectedCount})
                  </>
                )}
              </Button>
              <Button
                onClick={() => setExpanded(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 