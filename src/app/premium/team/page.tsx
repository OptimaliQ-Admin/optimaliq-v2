"use client";

import { useEffect, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { useRouter } from "next/navigation";

type Campaign = { id: string; title: string; type_slug: string; status: string; due_at: string | null; created_at: string };
type Assignment = { id: string; assignee_u_id: string; status: string; due_at: string | null; created_at: string };

export default function TeamWorkspacePage() {
  const { user } = usePremiumUser();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/team/campaigns?u_id=${user.id}`);
      const json = await res.json();
      setCampaigns(json.campaigns || []);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedCampaignId) return;
    const load = async () => {
      const res = await fetch(`/api/team/assignments?campaign_id=${selectedCampaignId}`);
      const json = await res.json();
      setAssignments(json.assignments || []);
    };
    load();
  }, [selectedCampaignId]);

  const createCampaign = async () => {
    if (!user?.id) return;
    const title = prompt("Campaign title?") || "Team Assessment";
    const type_slug = prompt("Assessment type (e.g., bpm, sales, tech_stack)?") || "bpm";
    const res = await fetch("/api/team/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_u_id: user.id, type_slug, title })
    });
    const json = await res.json();
    if (res.ok) {
      setCampaigns([json.campaign, ...campaigns]);
    } else {
      alert(json.error || "Failed to create campaign");
    }
  };

  const addAssignment = async (campaignId: string) => {
    const assignee = prompt("Assignee user ID?");
    if (!assignee) return;
    const res = await fetch("/api/team/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: campaignId, assignee_u_id: assignee })
    });
    const json = await res.json();
    if (res.ok) {
      setAssignments([json.assignment, ...assignments]);
    } else {
      alert(json.error || "Failed to add assignment");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Workspace</h1>
      </div>
      <div className="mb-4 border-b">
        <div className="flex gap-4">
          <button className="px-3 py-2 border-b-2 border-blue-600">Dashboard</button>
          <button className="px-3 py-2">Campaigns</button>
          <button className="px-3 py-2">People</button>
          <button className="px-3 py-2">Submissions</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Campaigns</h2>
            <button onClick={createCampaign} className="px-3 py-2 bg-blue-600 text-white rounded">New Campaign</button>
          </div>
          {loading && <div>Loading…</div>}
          <ul className="space-y-2">
            {campaigns.map(c => (
              <li key={c.id} className={`p-3 border rounded cursor-pointer ${selectedCampaignId===c.id? 'bg-blue-50':''}`}
                  onClick={() => setSelectedCampaignId(c.id)}>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-gray-600">{c.type_slug} • {new Date(c.created_at).toLocaleString()}</div>
              </li>
            ))}
            {campaigns.length===0 && !loading && <div className="text-sm text-gray-500">No campaigns yet.</div>}
          </ul>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Assignments</h2>
            {selectedCampaignId && (
              <button onClick={() => addAssignment(selectedCampaignId)} className="px-3 py-2 bg-gray-800 text-white rounded">Add Assignment</button>
            )}
          </div>
          <ul className="space-y-2">
            {assignments.map(a => (
              <li key={a.id} className="p-3 border rounded">
                <div className="font-medium">Assignee: {a.assignee_u_id}</div>
                <div className="text-sm text-gray-600">Status: {a.status}</div>
              </li>
            ))}
            {selectedCampaignId && assignments.length===0 && <div className="text-sm text-gray-500">No assignments yet.</div>}
          </ul>
        </div>
      </div>
    </div>
  );
}


