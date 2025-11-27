import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Instagram, Users, Mail, Globe, Clock,
  CheckCircle, AlertTriangle, Trash2, Send, UserPlus,
  ArrowRight, Download, Check
} from 'lucide-react';

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const [formData, setFormData] = useState({
    handle: '', country: '', email: '', isUnicorn: false, has10k: false,
  });

  // Get unique countries from existing leads
  const uniqueCountries = useMemo(() => {
    const countries = leads.map(l => l.country).filter(Boolean);
    return [...new Set(countries)].sort();
  }, [leads]);

  // --- Logic ---
  const addLead = (e) => {
    e.preventDefault();
    if (!formData.handle) return;

    // Clean handle - extract username from URL or handle
    let cleanHandle = formData.handle.trim();
    // Remove @ symbol
    cleanHandle = cleanHandle.replace('@', '');
    // Extract from full URL (https://www.instagram.com/username/ or https://instagram.com/username)
    const urlMatch = cleanHandle.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^\/\?]+)/);
    if (urlMatch) {
      cleanHandle = urlMatch[1];
    } else {
      // Remove any remaining slashes
      cleanHandle = cleanHandle.replace(/\//g, '');
    }

    // Check for duplicates
    const isDuplicate = leads.some(lead => lead.handle.toLowerCase() === cleanHandle.toLowerCase());
    if (isDuplicate) {
      alert(`@${cleanHandle} is already in your pipeline!`);
      return;
    }

    const newLead = {
      id: Date.now(),
      ...formData,
      handle: cleanHandle,
      status: 'new', // new, dm_sent, friends_dmed
      emailSent: false,
      createdAt: Date.now(),
      dmSentAt: null
    };

    setLeads(prev => [newLead, ...prev]);
    // Reset form completely
    setFormData({ handle: '', country: '', email: '', isUnicorn: false, has10k: false });
  };

  const updateStatus = (id, newStatus) => {
    setLeads(leads.map(lead => {
      if (lead.id === id) {
        return {
          ...lead,
          status: newStatus,
          dmSentAt: newStatus === 'dm_sent' ? Date.now() : lead.dmSentAt
        };
      }
      return lead;
    }));
  };

  const toggleEmailSent = (id) => {
    setLeads(leads.map(lead =>
      lead.id === id ? { ...lead, emailSent: !lead.emailSent } : lead
    ));
  };

  const deleteLead = (id) => {
    if (confirm('Delete?')) setLeads(leads.filter(l => l.id !== id));
  };

  const getTimerStatus = (timestamp) => {
    if (!timestamp) return { label: 'Not Sent', color: 'text-gray-400', urgent: false };
    const diffHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (diffHours >= 12) return { label: `+${Math.floor(diffHours)}h passed`, color: 'text-red-500 font-bold', urgent: true };
    return { label: `${Math.floor(12 - diffHours)}h remaining`, color: 'text-emerald-500', urgent: false };
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
      date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Sort: Urgent first, then status
  const sortedLeads = [...leads].sort((a, b) => {
    // Mock scoring for sort
    const getScore = (l) => {
      if (l.status === 'friends_dmed') return 0;
      const timer = getTimerStatus(l.dmSentAt);
      if (timer.urgent) return 100;
      if (l.status === 'dm_sent') return 50;
      return 25;
    };
    return getScore(b) - getScore(a);
  });

  const filteredLeads = sortedLeads.filter(l => {
    // Status filters
    if (filter === 'all') {
      // Continue to country filter
    } else {
      const timer = getTimerStatus(l.dmSentAt);
      if (filter === 'urgent' && !timer.urgent) return false;
      if (filter === 'new' && l.status !== 'new') return false;
      if (filter === 'pending' && !(l.status === 'dm_sent' && !timer.urgent)) return false;
      if (filter === 'unicorn' && !l.isUnicorn) return false;
      if (filter === '10k' && !l.has10k) return false;
      if (filter === 'both' && !(l.isUnicorn && l.has10k)) return false;
    }

    // Country filter
    if (countryFilter !== 'all' && l.country !== countryFilter) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM */}
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400"><UserPlus /> Quick Add</h2>
          <form onSubmit={addLead} className="space-y-4">
            <input
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-indigo-500 outline-none"
              placeholder="Instagram Handle (@)"
              value={formData.handle}
              onChange={e => setFormData({ ...formData, handle: e.target.value })}
              autoFocus
            />
            <input
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-indigo-500 outline-none"
              placeholder="Email (Optional)"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="relative">
              <input
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-indigo-500 outline-none"
                placeholder="Country (Optional)"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                list="countries-list"
              />
              <datalist id="countries-list">
                {uniqueCountries.map(country => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setFormData({ ...formData, isUnicorn: !formData.isUnicorn })} className={`flex-1 p-2 rounded border ${formData.isUnicorn ? 'bg-pink-900 border-pink-500 text-pink-400' : 'border-slate-700 text-slate-500'}`}>Unicorn 🦄</button>
              <button type="button" onClick={() => setFormData({ ...formData, has10k: !formData.has10k })} className={`flex-1 p-2 rounded border ${formData.has10k ? 'bg-blue-900 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-500'}`}>10k+ ⭐️</button>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded flex justify-center items-center gap-2">Add to Pipeline <ArrowRight size={16} /></button>
          </form>
        </section>

        {/* LIST */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex gap-2 pb-2 flex-wrap items-center">
            {['all', 'urgent', 'new', 'pending', 'unicorn', '10k', 'both'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {f === 'unicorn' ? '🦄 Unicorn' : f === '10k' ? '⭐️ 10k+' : f === 'both' ? '🦄⭐️ Both' : f}
              </button>
            ))}

            {/* Country Filter Dropdown */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {filteredLeads.map(lead => {
            const timer = getTimerStatus(lead.dmSentAt);
            const isUrgent = lead.status === 'dm_sent' && timer.urgent;

            return (
              <div key={lead.id} className={`bg-slate-800 rounded-lg p-2 border relative flex items-center justify-between gap-3 ${isUrgent ? 'border-red-500' : 'border-slate-700'}`}>
                {/* Left Side: Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://www.instagram.com/${lead.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-base text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      @{lead.handle}
                      <Instagram size={14} className="opacity-60" />
                    </a>

                    {/* Badges */}
                    <div className="flex gap-1 text-[10px]">
                      {lead.isUnicorn && <span className="text-pink-400 border border-pink-500/30 px-1 rounded bg-pink-500/10">Unicorn</span>}
                      {lead.has10k && <span className="text-blue-400 border border-blue-500/30 px-1 rounded bg-blue-500/10">10k+</span>}
                      {lead.country && <span className="text-slate-400 border border-slate-700 px-1 rounded">{lead.country}</span>}
                    </div>

                    <span className="text-[10px] text-slate-500 flex items-center gap-1 ml-1">
                      <Clock size={10} />
                      {formatDateTime(lead.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Email Action */}
                  {lead.email && (
                    <button onClick={() => toggleEmailSent(lead.id)} className={`text-[10px] px-2 py-1 rounded flex items-center gap-1 transition-colors ${lead.emailSent ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/50' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                      <Mail size={10} /> {lead.emailSent ? 'Sent' : 'Email'}
                    </button>
                  )}

                  {/* DM Action */}
                  {lead.status === 'new' && (
                    <button onClick={() => updateStatus(lead.id, 'dm_sent')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><Send size={10} /> DM</button>
                  )}
                  {lead.status === 'dm_sent' && (
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${timer.color}`}>{timer.urgent ? "⚠️ TIME UP" : timer.label}</span>
                      <button onClick={() => updateStatus(lead.id, 'friends_dmed')} className="bg-slate-700 hover:bg-slate-600 text-white text-[10px] px-2 py-1 rounded">Friends</button>
                    </div>
                  )}
                  {lead.status === 'friends_dmed' && <span className="text-slate-500 text-[10px] line-through">Done</span>}

                  {/* Delete */}
                  <button onClick={() => deleteLead(lead.id)} className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-slate-700/50"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
          {filteredLeads.length === 0 && <div className="text-center text-slate-500 py-10">No leads match your filters.</div>}
          {leads.length === 0 && <div className="text-center text-slate-500 py-10">No leads yet. Add one!</div>}
        </section>
      </div>
    </div>
  );
}
