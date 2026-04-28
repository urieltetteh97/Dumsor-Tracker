/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  Map as MapIcon, 
  Info, 
  Bell, 
  User, 
  LogOut,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, differenceInMinutes } from 'date-fns';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { useDumsor } from './hooks/useDumsor';
import { REGIONS_DATA, DUMSOR_SCHEDULE, TIME_SLOTS, Group } from './data/dumsorData';

// Placeholder components to be implemented later or defined inline
import ScheduleTable from './components/ScheduleTable';
import MapView from './components/MapView';
import ReportForm from './components/ReportForm';

export default function App() {
  const [activeTab, setActiveTab ] = useState('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userGroup, setUserGroup] = useState<Group | null>(null);
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const dumsor = useDumsor();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const currentStatus = dumsor?.currentGroupOff;
  const isUserOff = userGroup && currentStatus === userGroup;

  const nextOutageForUser = useMemo(() => {
    if (!userGroup || !dumsor?.nextOutage) return null;
    // For simplicity, we only show if the next slot is theirs
    // In reality, we should scan the schedule
    return dumsor.nextOutage.group === userGroup ? dumsor.nextOutage : null;
  }, [userGroup, dumsor]);

  // Alert logic: 30 minutes before
  useEffect(() => {
    if (userGroup && dumsor?.nextOutage && dumsor.nextOutage.group === userGroup) {
      const diff = differenceInMinutes(dumsor.nextOutage.startTime, dumsor.now);
      if (diff === 30) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Dumsor Alert", {
            body: `Power outage scheduled for Group ${userGroup} in 30 minutes.`,
          });
        } else {
          // Fallback to internal alert if notification permission not granted
          console.log("30 minute warning!");
        }
      }
    }
  }, [dumsor?.now, userGroup, dumsor?.nextOutage]);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white">
              <AlertTriangle size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">DumsorTracker</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={requestNotificationPermission}
                  className="p-2 text-neutral-500 hover:text-amber-500 transition-colors"
                >
                  <Bell size={20} />
                </button>
                <img 
                  src={user.photoURL || ""} 
                  alt={user.displayName || ""} 
                  className="w-8 h-8 rounded-full border border-neutral-200"
                />
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Status Hero */}
              <div className={`p-6 rounded-3xl border-2 transition-colors duration-500 ${
                isUserOff ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-neutral-500 font-medium text-sm mb-1 uppercase tracking-wider">Current Power Status</h2>
                    <p className={`text-3xl font-bold ${isUserOff ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {isUserOff ? 'Power Scheduled Off' : 'Power Scheduled On'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isUserOff ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {isUserOff ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                  </div>
                </div>

                {!userGroup && (
                  <div className="mt-6 p-4 bg-white/60 backdrop-blur rounded-2xl border border-amber-100">
                    <p className="text-sm text-neutral-600 mb-3">Set your group to get personalized alerts for your location.</p>
                    <div className="flex gap-2">
                      <select 
                        className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => setUserRegion(e.target.value)}
                      >
                        <option value="">Select Region</option>
                        {REGIONS_DATA.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                      </select>
                      <select 
                        className="w-24 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => setUserGroup(e.target.value as Group)}
                      >
                        <option value="">Group</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                  </div>
                )}

                {userGroup && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-4 rounded-2xl">
                      <p className="text-xs text-neutral-500 mb-1">YOUR GROUP</p>
                      <p className="text-lg font-bold">Group {userGroup}</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-2xl">
                      <p className="text-xs text-neutral-500 mb-1">LOCATION</p>
                      <p className="text-lg font-bold">{userRegion || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Outage Info */}
              {userGroup && (
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-neutral-400" size={20} />
                    <h3 className="font-semibold">Next Scheduled Outage</h3>
                  </div>
                  {nextOutageForUser ? (
                    <div>
                      <p className="text-2xl font-bold text-neutral-800">{nextOutageForUser.time}</p>
                      <p className="text-neutral-500 text-sm mt-1">
                        Starts in {differenceInMinutes(nextOutageForUser.startTime, dumsor.now)} minutes
                      </p>
                    </div>
                  ) : (
                    <p className="text-neutral-500">No scheduled outage in the next slot.</p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('report')}
                  className="bg-neutral-900 text-white p-5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-neutral-800 transition-all active:scale-95"
                >
                  <AlertTriangle size={24} />
                  <span className="font-semibold text-sm">Report Outage</span>
                </button>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="bg-white border border-neutral-200 p-5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-neutral-50 transition-all active:scale-95"
                >
                  <Calendar size={24} className="text-amber-500" />
                  <span className="font-semibold text-sm">Full Schedule</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div 
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Timetable</h2>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="text-neutral-500 text-sm flex items-center gap-1"
                >
                  Back to Dashboard
                </button>
              </div>
              <ScheduleTable />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-[600px] rounded-3xl overflow-hidden border border-neutral-200"
            >
              <MapView />
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Report an Outage</h2>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="text-neutral-500 text-sm"
                >
                  Cancel
                </button>
              </div>
              <ReportForm onComplete={() => setActiveTab('dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<Clock size={24} />}
            label="Live"
          />
          <NavButton 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')}
            icon={<Calendar size={24} />}
            label="Schedules"
          />
          <NavButton 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')}
            icon={<MapIcon size={24} />}
            label="Map"
          />
          <NavButton 
            active={activeTab === 'report'} 
            onClick={() => setActiveTab('report')}
            icon={<AlertTriangle size={24} />}
            label="Report"
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-16 transition-all ${
        active ? 'text-amber-500 scale-110' : 'text-neutral-400 opacity-60'
      }`}
    >
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
    </button>
  );
}

