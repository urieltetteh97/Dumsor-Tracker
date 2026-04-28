/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { REGIONS_DATA } from '../data/dumsorData';
import { Loader2 } from 'lucide-react';

export default function ReportForm({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    region: '',
    location: '',
    type: 'OUTAGE',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please sign in to report");
    
    setLoading(true);
    const path = 'reports';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        timestamp: serverTimestamp(),
        reporterId: auth.currentUser.uid,
        coordinates: { lat: 5.6037 + (Math.random() - 0.5) * 0.1, lng: -0.1870 + (Math.random() - 0.5) * 0.1 } // Small jitter for visible markers
      });
      onComplete();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
      <div className="flex gap-2 p-1 bg-neutral-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'OUTAGE'})}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${formData.type === 'OUTAGE' ? 'bg-amber-500 text-white shadow-lg' : 'text-neutral-500'}`}
        >
          Power is OUT
        </button>
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'UNEXPECTED_ON'})}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${formData.type === 'UNEXPECTED_ON' ? 'bg-emerald-500 text-white shadow-lg' : 'text-neutral-500'}`}
        >
          Power is ON
        </button>
      </div>
      <div>
        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Region</label>
        <select 
          required
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
          value={formData.region}
          onChange={(e) => setFormData({...formData, region: e.target.value})}
        >
          <option value="">Select Region</option>
          {REGIONS_DATA.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Location / Area Name</label>
        <input 
          required
          type="text"
          placeholder="e.g. East Legon, near Shell"
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Details (Optional)</label>
        <textarea 
          placeholder="e.g. Outage started at 2pm, still no light."
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-amber-500 transition-all outline-none resize-none"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <button 
        disabled={loading}
        type="submit"
        className="w-full bg-neutral-900 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Report"}
      </button>
    </form>
  );
}
