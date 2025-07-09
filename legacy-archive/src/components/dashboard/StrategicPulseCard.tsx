'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Send, Target, Users } from 'lucide-react';
import { showToast } from '@/lib/utils/toast';

interface TeamMember {
  id: string;
  member_email: string;
  member_name: string;
  role: string;
  department: string;
  created_at: string;
}

interface StrategicPulseCardProps {
  user: any;
  teamMembers: TeamMember[];
}

const DEPARTMENTS = [
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ops', label: 'Operations' },
  { value: 'product', label: 'Product' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'customer_success', label: 'Customer Success' }
];

const FOCUS_AREAS = [
  { value: 'pipeline', label: 'Pipeline Management' },
  { value: 'process', label: 'Process Optimization' },
  { value: 'tools', label: 'Tool Adoption' },
  { value: 'communication', label: 'Communication' },
  { value: 'alignment', label: 'Goal Alignment' },
  { value: 'efficiency', label: 'Operational Efficiency' },
  { value: 'collaboration', label: 'Team Collaboration' },
  { value: 'innovation', label: 'Innovation & Growth' }
];

export default function StrategicPulseCard({ user, teamMembers }: StrategicPulseCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [selectedDelegateId, setSelectedDelegateId] = useState('');

  const handleFocusAreaToggle = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    if (!title || !department || selectedFocusAreas.length === 0 || !selectedDelegateId) {
      showToast.error("Please fill in all required fields.");
      return;
    }

    const selectedDelegate = teamMembers.find(member => member.id === selectedDelegateId);
    if (!selectedDelegate) {
      showToast.error("Please select a valid delegate.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/strategic-pulse/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          department,
          areasOfFocus: selectedFocusAreas,
          delegateEmail: selectedDelegate.member_email,
          delegateName: selectedDelegate.member_name
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create pulse check');
      }

      showToast.success("Pulse check created and delegation email sent successfully.");

      // Reset form
      setTitle('');
      setDepartment('');
      setSelectedFocusAreas([]);
      setSelectedDelegateId('');
      setIsCreating(false);

    } catch (error) {
      console.error('Error creating pulse check:', error);
      showToast.error(error instanceof Error ? error.message : "Failed to create pulse check");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreating) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <h3 className="flex items-center gap-2 text-blue-900 text-lg font-semibold">
            <Target className="w-5 h-5" />
            Strategic Pulse Check
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Create a focused pulse check to get quick feedback from your team on specific strategic priorities.
          </p>
          <Button 
            onClick={() => setIsCreating(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Pulse Check
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <h3 className="flex items-center gap-2 text-blue-900 text-lg font-semibold">
          <Target className="w-5 h-5" />
          Create Strategic Pulse Check
        </h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Pulse Check Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Q3 Sales Pipeline Visibility"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Target Department *</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
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

        {/* Focus Areas */}
        <div className="space-y-2">
          <Label>Areas of Focus *</Label>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_AREAS.map((area) => (
              <div key={area.value} className="flex items-center space-x-2">
                <Checkbox
                  id={area.value}
                  checked={selectedFocusAreas.includes(area.value)}
                  onCheckedChange={() => handleFocusAreaToggle(area.value)}
                />
                <Label htmlFor={area.value} className="text-sm">
                  {area.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Delegate Selection */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Delegate Assignment
          </Label>
          
          {teamMembers.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                No team members available. Please add team members before creating a pulse check.
              </p>
            </div>
          ) : (
            <Select value={selectedDelegateId} onValueChange={setSelectedDelegateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team member to delegate to" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{member.member_name}</span>
                      <span className="text-xs text-gray-500">{member.member_email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || teamMembers.length === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Create & Send
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setIsCreating(false);
              setTitle('');
              setDepartment('');
              setSelectedFocusAreas([]);
              setSelectedDelegateId('');
            }}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 