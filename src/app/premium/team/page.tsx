"use client";

import { useEffect, useMemo, useState } from "react";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { motion } from "framer-motion";

type Person = { id: string; first_name: string; last_name: string; email: string; department?: string | null; title?: string | null; status: string };
type Campaign = { id: string; title: string; type_slug: string; status: string; due_at: string | null; created_at: string };
type Assignment = { id: string; assignee_u_id: string; status: string; due_at: string | null; created_at: string; campaign_id: string };

export default function TeamWorkspacePage() {
  const { user } = usePremiumUser();

  const [activeTab, setActiveTab] = useState<'team'|'assessments'|'generate'>('team');

  // Team state
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', department: '', title: '' });
  const [departments, setDepartments] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const res = await fetch(`/api/team/dictionaries?u_id=${user.id}`);
      const json = await res.json();
      setDepartments(json.departments || []);
      setTitles(json.titles || []);
    })();
  }, [user?.id]);

  // Assessment state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [assignmentsByCampaign, setAssignmentsByCampaign] = useState<Record<string, Assignment[]>>({});
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState<{ topic: string; personIds: string[] }>({ topic: '', personIds: [] });

  // Generate state
  const [customCampaigns, setCustomCampaigns] = useState<Campaign[]>([]);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState<{ topic: string; personIds: string[] }>({ topic: '', personIds: [] });
  const topicOptions = [
    'Sales Pipeline Health',
    'Customer Satisfaction & NPS',
    'Operational Efficiency',
    'Product Quality & Release Readiness',
    'Employee Engagement & Retention',
    'Marketing Funnel Effectiveness',
    'Onboarding & Customer Experience',
    'Cost Optimization & Margin Expansion',
    'Innovation Velocity & R&D Effectiveness',
    'Risk & Compliance Readiness'
  ];

  // Load team people
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoadingPeople(true);
      const res = await fetch(`/api/team/people?u_id=${user.id}`);
      const json = await res.json();
      setPeople(json.people || []);
      setLoadingPeople(false);
    })();
  }, [user?.id]);

  // Load campaigns and assignments summary
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoadingAssessments(true);
      const res = await fetch(`/api/team/campaigns?u_id=${user.id}`);
      const json = await res.json();
      const camps: Campaign[] = json.campaigns || [];
      setCampaigns(camps);
      // For each campaign, fetch assignments
      const byCamp: Record<string, Assignment[]> = {};
      await Promise.all(
        camps.map(async c => {
          const r = await fetch(`/api/team/assignments?campaign_id=${c.id}`);
          const j = await r.json();
          byCamp[c.id] = (j.assignments || []).map((a: any) => ({ ...a, campaign_id: c.id }));
        })
      );
      setAssignmentsByCampaign(byCamp);
      setLoadingAssessments(false);
    })();
  }, [user?.id]);

  // Load generate history (custom_*)
  useEffect(() => {
    setCustomCampaigns(campaigns.filter(c => c.type_slug?.startsWith('custom_')));
  }, [campaigns]);

  // Team actions
  const handleAddPerson = async () => {
    if (!user?.id) return;
    const payload = { u_id: user.id, ...form };
    const res = await fetch('/api/team/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (res.ok) {
      setPeople([json.person, ...people]);
      setShowAddModal(false);
      setForm({ first_name: '', last_name: '', email: '', department: '', title: '' });
    } else {
      alert(json.error || 'Failed to add person');
    }
  };

  const handleDeletePerson = async (id: string) => {
    if (!user?.id) return;
    if (!confirm('Remove this team member?')) return;
    const res = await fetch(`/api/team/people?id=${id}&u_id=${user.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (res.ok) {
      setPeople(prev => prev.filter(p => p.id !== id));
    } else {
      alert(json.error || 'Failed to remove');
    }
  };

  // Assignment via pulse/custom generator (email invites)
  const handleAssignAssessment = async () => {
    if (!user?.id) return;
    const emails = people.filter(p => assignForm.personIds.includes(p.id)).map(p => p.email);
    if (!assignForm.topic || emails.length === 0) { alert('Pick a topic and at least one person'); return; }
    const res = await fetch('/api/team/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_u_id: user.id, type: 'pulse', topic: assignForm.topic, participant_emails: emails })
    });
    const json = await res.json();
    if (res.ok) {
      setShowAssignModal(false);
      setAssignForm({ topic: '', personIds: [] });
      // Refresh campaigns
      const r = await fetch(`/api/team/campaigns?u_id=${user.id}`);
      const j = await r.json();
      setCampaigns(j.campaigns || []);
    } else {
      alert(json.error || 'Failed to assign');
    }
  };

  // Generate new custom assessment
  const handleGenerateAssessment = async () => {
    if (!user?.id) return;
    const emails = people.filter(p => generateForm.personIds.includes(p.id)).map(p => p.email);
    if (!generateForm.topic || emails.length === 0) { alert('Pick a topic and at least one person'); return; }
    const res = await fetch('/api/team/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_u_id: user.id, type: 'custom', topic: generateForm.topic, participant_emails: emails })
    });
    const json = await res.json();
    if (res.ok) {
      setShowGenerateModal(false);
      setGenerateForm({ topic: '', personIds: [] });
      const r = await fetch(`/api/team/campaigns?u_id=${user.id}`);
      const j = await r.json();
      setCampaigns(j.campaigns || []);
    } else {
      alert(json.error || 'Failed to generate');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Team Workspace</h1>
            <p className="text-xs text-gray-500">Manage your organization’s people and assessments</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">{people.length} Members</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar text-sm">
            {[
              { key: 'team', label: 'Team' },
              { key: 'assessments', label: 'Assessments' },
              { key: 'generate', label: 'Generate' },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                className={`px-4 py-2 border-b-2 -mb-px ${activeTab===t.key ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto p-6 space-y-10">
        {/* Team Tab */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: activeTab==='team'?1:0, y: activeTab==='team'?0:10 }} className={`${activeTab==='team' ? 'block' : 'hidden'}`}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Team</h3>
                <p className="text-sm text-gray-500">Add or remove members of your organization</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="inline-flex items-center rounded-lg bg-blue-600 text-white text-sm font-semibold px-3 py-2 hover:bg-blue-700 shadow-sm">+ Add Member</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-medium px-6 py-3">Name</th>
                    <th className="text-left font-medium px-6 py-3">Email</th>
                    <th className="text-left font-medium px-6 py-3">Department</th>
                    <th className="text-left font-medium px-6 py-3">Title</th>
                    <th className="text-left font-medium px-6 py-3">Status</th>
                    <th className="text-right font-medium px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingPeople && (
                    <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-500">Loading team…</td></tr>
                  )}
                  {!loadingPeople && people.length===0 && (
                    <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-500">No team members yet.</td></tr>
                  )}
                  {people.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3 text-gray-900 font-medium">{p.first_name} {p.last_name}</td>
                      <td className="px-6 py-3 text-gray-700">{p.email}</td>
                      <td className="px-6 py-3 text-gray-700">{p.department || '—'}</td>
                      <td className="px-6 py-3 text-gray-700">{p.title || '—'}</td>
                      <td className="px-6 py-3"><span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${p.status==='active'?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-gray-50 text-gray-600 border border-gray-200'}`}>{p.status}</span></td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => handleDeletePerson(p.id)} className="text-xs text-red-600 hover:text-red-700 font-semibold">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Assessments Tab */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: activeTab==='assessments'?1:0, y: activeTab==='assessments'?0:10 }} className={`${activeTab==='assessments' ? 'block' : 'hidden'}`}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Assigned Assessments</h3>
                <p className="text-sm text-gray-500">Summary of assignments and status</p>
              </div>
              <button onClick={() => setShowAssignModal(true)} className="inline-flex items-center rounded-lg bg-blue-600 text-white text-sm font-semibold px-3 py-2 hover:bg-blue-700 shadow-sm">Assign Assessment</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-medium px-6 py-3">Assessment</th>
                    <th className="text-left font-medium px-6 py-3">Campaign Created</th>
                    <th className="text-left font-medium px-6 py-3">Assignments</th>
                    <th className="text-left font-medium px-6 py-3">Completed</th>
                    <th className="text-left font-medium px-6 py-3">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingAssessments && (
                    <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Loading…</td></tr>
                  )}
                  {!loadingAssessments && campaigns.length===0 && (
                    <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">No campaigns yet.</td></tr>
                  )}
                  {campaigns.map(c => {
                    const list = assignmentsByCampaign[c.id] || [];
                    const completed = list.filter(a => a.status==='completed' || a.status==='submitted').length;
                    const pending = list.filter(a => a.status!=='completed' && a.status!=='submitted').length;
                    return (
                      <tr key={c.id}>
                        <td className="px-6 py-3 text-gray-900 font-medium">{c.title}</td>
                        <td className="px-6 py-3 text-gray-700">{new Date(c.created_at).toLocaleString()}</td>
                        <td className="px-6 py-3 text-gray-700">{list.length}</td>
                        <td className="px-6 py-3 text-gray-700">{completed}</td>
                        <td className="px-6 py-3 text-gray-700">{pending}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Generate Tab */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: activeTab==='generate'?1:0, y: activeTab==='generate'?0:10 }} className={`${activeTab==='generate' ? 'block' : 'hidden'}`}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Custom & Pulse Assessments</h3>
                <p className="text-sm text-gray-500">Create topic-focused assessments and review history</p>
              </div>
              <button onClick={() => setShowGenerateModal(true)} className="inline-flex items-center rounded-lg bg-blue-600 text-white text-sm font-semibold px-3 py-2 hover:bg-blue-700 shadow-sm">New Custom Assessment</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-medium px-6 py-3">Title</th>
                    <th className="text-left font-medium px-6 py-3">Created</th>
                    <th className="text-left font-medium px-6 py-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customCampaigns.length===0 && (
                    <tr><td colSpan={3} className="px-6 py-6 text-center text-gray-500">No custom assessments yet.</td></tr>
                  )}
                  {customCampaigns.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-3 text-gray-900 font-medium">{c.title}</td>
                      <td className="px-6 py-3 text-gray-700">{new Date(c.created_at).toLocaleString()}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">{c.type_slug}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">First Name</label>
                <input value={form.first_name} onChange={e=>setForm(f=>({...f, first_name: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                <input value={form.last_name} onChange={e=>setForm(f=>({...f, last_name: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Department</label>
                <select value={form.department} onChange={e=>setForm(f=>({...f, department: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title</label>
                <select value={form.title} onChange={e=>setForm(f=>({...f, title: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {titles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={()=>setShowAddModal(false)} className="px-3 py-2 text-sm rounded-lg border">Cancel</button>
              <button onClick={handleAddPerson} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Assessment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assign Assessment</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Assessment Topic</label>
                <select value={assignForm.topic} onChange={e=>setAssignForm(s=>({...s, topic: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {['Business Process Maturity','Sales Performance','Marketing Effectiveness','Technology Maturity','AI Readiness','Digital Transformation','Strategic Maturity','Competitive Benchmarking','Leadership & Team Performance','Customer Experience'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">People</label>
                <div className="max-h-40 overflow-auto border rounded-lg">
                  {people.map(p => (
                    <label key={p.id} className="flex items-center gap-3 px-3 py-2 text-sm border-b last:border-b-0">
                      <input type="checkbox" checked={assignForm.personIds.includes(p.id)} onChange={(e)=>{
                        const checked = e.target.checked;
                        setAssignForm(s=>({ ...s, personIds: checked ? [...s.personIds, p.id] : s.personIds.filter(id=>id!==p.id) }));
                      }} />
                      <span>{p.first_name} {p.last_name} – {p.email}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={()=>setShowAssignModal(false)} className="px-3 py-2 text-sm rounded-lg border">Cancel</button>
              <button onClick={handleAssignAssessment} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Custom Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Custom Assessment</h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Topic</label>
                <select value={generateForm.topic} onChange={e=>setGenerateForm(s=>({...s, topic: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {topicOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">People</label>
                <div className="max-h-40 overflow-auto border rounded-lg">
                  {people.map(p => (
                    <label key={p.id} className="flex items-center gap-3 px-3 py-2 text-sm border-b last:border-b-0">
                      <input type="checkbox" checked={generateForm.personIds.includes(p.id)} onChange={(e)=>{
                        const checked = e.target.checked;
                        setGenerateForm(s=>({ ...s, personIds: checked ? [...s.personIds, p.id] : s.personIds.filter(id=>id!==p.id) }));
                      }} />
                      <span>{p.first_name} {p.last_name} – {p.email}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={()=>setShowGenerateModal(false)} className="px-3 py-2 text-sm rounded-lg border">Cancel</button>
              <button onClick={handleGenerateAssessment} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

