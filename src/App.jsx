import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Instagram, Users, Mail, Globe, Clock,
  CheckCircle, AlertTriangle, Trash2, Send, UserPlus,
  ArrowRight, Download, Check, Search
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    handle: '', country: '', email: '', isUnicorn: false, has10k: false, isInspiration: false, isOF: false,
  });

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map snake_case DB columns to camelCase for the UI
      const formattedLeads = data.map(lead => ({
        id: lead.id,
        handle: lead.handle,
        country: lead.country,
        email: lead.email,
        isUnicorn: lead.is_unicorn,
        has10k: lead.has_10k,
        isInspiration: lead.is_inspiration || false,
        isOF: lead.is_of || false,
        status: lead.status,
        emailSent: lead.email_sent,
        createdAt: new Date(lead.created_at).getTime(),
        dmSentAt: lead.dm_sent_at ? new Date(lead.dm_sent_at).getTime() : null
      }));

      setLeads(formattedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error.message);
      alert('Error loading leads!');
    } finally {
      setLoading(false);
    }
  };

  // Get unique countries from existing leads
  const uniqueCountries = useMemo(() => {
    const countries = leads.map(l => l.country).filter(Boolean);
    return [...new Set(countries)].sort();
  }, [leads]);

  // --- Logic ---
  const addLead = async (e) => {
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

    try {
      const newLead = {
        handle: cleanHandle,
        country: formData.country,
        email: formData.email,
        is_unicorn: formData.isUnicorn,
        has_10k: formData.has10k,
        is_inspiration: formData.isInspiration,
        is_of: formData.isOF,
        status: 'new',
        email_sent: false,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select();

      if (error) throw error;

      // Optimistically update UI or re-fetch
      // Re-fetching is safer to get the real ID
      fetchLeads();

      // Reset form completely
      setFormData({ handle: '', country: '', email: '', isUnicorn: false, has10k: false, isInspiration: false, isOF: false });
    } catch (error) {
      console.error('Error adding lead:', error.message);
      alert('Error adding lead!');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const updates = {
        status: newStatus,
        dm_sent_at: newStatus === 'dm_sent' ? new Date().toISOString() : undefined
      };

      // If we are just moving to friends_dmed, we don't change dm_sent_at
      if (newStatus === 'friends_dmed') {
        delete updates.dm_sent_at;
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
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
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  const toggleEmailSent = async (id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ email_sent: !lead.emailSent })
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.map(l =>
        l.id === id ? { ...l, emailSent: !l.emailSent } : l
      ));
    } catch (error) {
      console.error('Error updating email status:', error.message);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Delete?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error.message);
    }
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
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesHandle = l.handle.toLowerCase().includes(query);
      const matchesCountry = l.country && l.country.toLowerCase().includes(query);
      const matchesEmail = l.email && l.email.toLowerCase().includes(query);

      if (!matchesHandle && !matchesCountry && !matchesEmail) return false;
    }

    // Inspiration filter: ONLY show inspiration leads
    if (filter === 'inspiration') {
      if (!l.isInspiration) return false;
    } else {
      // All other filters: EXCLUDE inspiration leads
      if (l.isInspiration) return false;

      // Status filters (only apply to non-inspiration leads)
      if (filter !== 'all') {
        const timer = getTimerStatus(l.dmSentAt);
        if (filter === 'urgent' && !timer.urgent) return false;
        if (filter === 'new' && l.status !== 'new') return false;
        if (filter === 'pending' && !(l.status === 'dm_sent' && !timer.urgent)) return false;
        if (filter === 'unicorn' && !l.isUnicorn) return false;
        if (filter === '10k' && !l.has10k) return false;
        if (filter === 'both' && !(l.isUnicorn && l.has10k)) return false;
        if (filter === 'of' && !l.isOF) return false;
      }
    }

    // Country filter
    if (countryFilter !== 'all' && l.country !== countryFilter) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM */}
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-fit lg:sticky lg:top-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400"><UserPlus /> Avengers Assemble</h2>
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
              <button type="button" onClick={() => setFormData({ ...formData, isUnicorn: !formData.isUnicorn })} className={`flex-1 p-3 rounded border ${formData.isUnicorn ? 'bg-pink-900 border-pink-500 text-pink-400' : 'border-slate-700 text-slate-500'}`}>🦄</button>
              <button type="button" onClick={() => setFormData({ ...formData, has10k: !formData.has10k })} className={`flex-1 p-3 rounded border ${formData.has10k ? 'bg-blue-900 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-500'}`}>10k ⭐️</button>
              <button type="button" onClick={() => setFormData({ ...formData, isInspiration: !formData.isInspiration })} className={`flex-1 p-3 rounded border ${formData.isInspiration ? 'bg-purple-900 border-purple-500 text-purple-400' : 'border-slate-700 text-slate-500'}`}>💡</button>
              <button type="button" onClick={() => setFormData({ ...formData, isOF: !formData.isOF })} className={`flex-1 p-3 rounded border ${formData.isOF ? 'bg-orange-900 border-orange-500 text-orange-400' : 'border-slate-700 text-slate-500'}`}>OF 🍑</button>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded flex justify-center items-center gap-2 active:scale-95 transition-transform">Add to Pipeline <ArrowRight size={16} /></button>
          </form>
        </section>

        {/* LIST */}
        <section className="lg:col-span-2 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-lg text-white focus:border-indigo-500 outline-none"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar items-center -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
            {['all', 'urgent', 'new', 'pending', 'unicorn', '10k', 'both', 'of', 'inspiration'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap shrink-0 ${filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {f === 'unicorn' ? '🦄 Unicorn' : f === '10k' ? '⭐️ 10k+' : f === 'both' ? '🦄⭐️ Both' : f === 'inspiration' ? '💡 Inspo' : f === 'of' ? 'OF 🍑' : f}
              </button>
            ))}

            {/* Country Filter Dropdown */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 outline-none focus:border-indigo-500 whitespace-nowrap shrink-0"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading leads...</div>
          ) : (
            <>
              {filteredLeads.map(lead => {
                const timer = getTimerStatus(lead.dmSentAt);
                const isUrgent = lead.status === 'dm_sent' && timer.urgent;

                return (
                  <div key={lead.id} className={`bg-slate-800 rounded-lg p-3 border relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isUrgent ? 'border-red-500' : 'border-slate-700'}`}>
                    {/* Left Side: Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-0">
                        <a
                          href={`https://www.instagram.com/${lead.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-lg text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          @{lead.handle}
                          <Instagram size={16} className="opacity-60" />
                        </a>

                        {/* Badges */}
                        <div className="flex gap-1 text-xs">
                          {lead.isUnicorn && <span className="text-pink-400 border border-pink-500/30 px-1.5 py-0.5 rounded bg-pink-500/10">Unicorn</span>}
                          {lead.has10k && <span className="text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded bg-blue-500/10">10k+</span>}
                          {lead.isInspiration && <span className="text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded bg-purple-500/10">Inspo</span>}
                          {lead.isOF && <span className="text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded bg-orange-500/10">OF 🍑</span>}
                          {lead.country && <span className="text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">{lead.country}</span>}
                        </div>

                        <span className="text-xs text-slate-500 flex items-center gap-1 ml-1">
                          <Clock size={12} />
                          {formatDateTime(lead.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-2 shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
                      {/* Email Action */}
                      {lead.email && (
                        <button
                          onClick={() => {
                            window.location.href = `mailto:${lead.email}`;
                            if (!lead.emailSent) toggleEmailSent(lead.id);
                          }}
                          className={`text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors whitespace-nowrap ${lead.emailSent ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/50' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                        >
                          <Mail size={12} /> {lead.emailSent ? 'Email sent' : 'Email'}
                        </button>
                      )}

                      {/* DM Action */}
                      {lead.status === 'new' && (
                        <button onClick={() => updateStatus(lead.id, 'dm_sent')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 whitespace-nowrap"><Send size={12} /> DM</button>
                      )}
                      {lead.status === 'dm_sent' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold whitespace-nowrap ${timer.color}`}>{timer.urgent ? "⚠️ TIME UP" : timer.label}</span>
                          <button onClick={() => updateStatus(lead.id, 'friends_dmed')} className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap">Friends</button>
                        </div>
                      )}
                      {lead.status === 'friends_dmed' && <span className="text-slate-500 text-xs line-through whitespace-nowrap">Done</span>}

                      {/* Delete */}
                      <button onClick={() => deleteLead(lead.id)} className="text-slate-600 hover:text-red-400 p-1.5 rounded hover:bg-slate-700/50"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )
              })}
              {filteredLeads.length === 0 && <div className="text-center text-slate-500 py-10">No leads match your filters.</div>}
              {leads.length === 0 && !loading && <div className="text-center text-slate-500 py-10">No leads yet. Add one!</div>}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
