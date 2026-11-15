import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  X, 
  BarChart3, 
  Zap, 
  Radio, 
  ShieldCheck, 
  Play, 
  Pause,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  getLiveUsersTelemetry, 
  getIndividualUsersActivityList, 
  getUserSessionHistory, 
  getLiveActivityFeed, 
  getDailyActiveAnalytics, 
  getEngagementAnalytics,
  formatDuration, 
  formatTimestamp, 
  formatShortDate 
} from '../../../services/admin/adminActivityService';

export const AdminLiveUsersTab = () => {
  // Navigation subtabs
  const [subTab, setSubTab] = useState('users'); // 'users' | 'feed' | 'analytics' | 'engagement'
  
  // Loading & Telemetry State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Data states
  const [telemetry, setTelemetry] = useState({
    currentlyActiveCount: 0,
    activeTodayCount: 0,
    activeYesterdayCount: 0,
    activeThisWeekCount: 0,
    activeThisMonthCount: 0,
    totalRegisteredUsers: 0,
    newRegistrationsToday: 0,
    returningUsersToday: 0,
    dauMauRatio: 0,
    totalActiveSecondsToday: 0,
    avgActiveTimePerUser: 0,
    lastUpdated: null
  });

  const [userList, setUserList] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [engagementData, setEngagementData] = useState(null);

  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Active' | 'Recently Active' | 'Offline'
  const [deviceFilter, setDeviceFilter] = useState('ALL'); // 'ALL' | 'Desktop' | 'Android' | 'iOS' | 'Tablet'

  // Date range filter for Daily Analytics
  const [dateRangeFilter, setDateRangeFilter] = useState('7d'); // 'today' | 'yesterday' | '7d' | '30d' | '90d'

  // User Session History Drawer
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Load all dashboard telemetry
  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [telemetryRes, usersRes, feedRes, dailyRes, engagementRes] = await Promise.all([
        getLiveUsersTelemetry(),
        getIndividualUsersActivityList(),
        getLiveActivityFeed(50),
        getDailyActiveAnalytics(dateRangeFilter),
        getEngagementAnalytics()
      ]);

      setTelemetry(telemetryRes);
      setUserList(usersRes);
      setActivityFeed(feedRes);
      setDailyData(dailyRes);
      setEngagementData(engagementRes);
    } catch (err) {
      console.error('[AdminLiveUsersTab] Error loading live telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCountdown(30);
    }
  }, [dateRangeFilter]);

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh timer (30s)
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadDashboardData(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, loadDashboardData]);

  // Handle opening user session drawer
  const handleOpenUserHistory = async (user) => {
    setSelectedUser(user);
    setLoadingSessions(true);
    try {
      const sessions = await getUserSessionHistory(user.uid);
      setUserSessions(sessions);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setUserSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Filtered individual user activity list
  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (u.name && u.name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchesDevice = deviceFilter === 'ALL' || u.device === deviceFilter;

      return matchesSearch && matchesStatus && matchesDevice;
    });
  }, [userList, searchQuery, statusFilter, deviceFilter]);

  // Render device icon helper
  const renderDeviceIcon = (device) => {
    switch (device) {
      case 'Android':
      case 'iOS':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4 text-purple-400" />;
      default:
        return <Monitor className="w-4 h-4 text-cyan-400" />;
    }
  };

  // Render status badge helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Active
          </span>
        );
      case 'Recently Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Recently Active
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            Offline
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Live Status & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Live Active Users & Monitoring
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
              Rolling 5m Window
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time verified presence heartbeats, authenticated session telemetry, and engagement tracking.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              autoRefresh 
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title={autoRefresh ? 'Pause auto-refresh' : 'Resume auto-refresh'}
          >
            {autoRefresh ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-refresh ({countdown}s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-refresh Paused</span>
              </>
            )}
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => loadDashboardData(false)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Last Updated Timestamp */}
          <span className="hidden lg:inline-block text-xs text-slate-500 font-mono">
            Updated: {formatTimestamp(telemetry.lastUpdated)}
          </span>
        </div>
      </div>

      {/* 2. Key Telemetry Grid (8 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Currently Active (5m) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Currently Active</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {telemetry.currentlyActiveCount}
            </span>
            <span className="text-xs text-emerald-500/80 font-medium">live now</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Activity in last 5 mins</p>
        </div>

        {/* Active Users Today (DAU) */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Today</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.activeTodayCount}
            </span>
            <span className="text-xs text-slate-400">DAU</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Since 00:00 midnight</p>
        </div>

        {/* Active Yesterday */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Yesterday</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.activeYesterdayCount}
            </span>
            <span className="text-xs text-slate-400">athletes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Previous 24-hr period</p>
        </div>

        {/* Active This Week (WAU) */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active This Week</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.activeThisWeekCount}
            </span>
            <span className="text-xs text-slate-400">WAU</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Last 7 rolling days</p>
        </div>

        {/* Active This Month (MAU) */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active This Month</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.activeThisMonthCount}
            </span>
            <span className="text-xs text-slate-400">MAU</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Calendar month active</p>
        </div>

        {/* Total Registered Users */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Registered</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.totalRegisteredUsers}
            </span>
            <span className="text-xs text-slate-400">total</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified accounts</p>
        </div>

        {/* New Registrations Today */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">New Registrations</span>
            <Zap className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.newRegistrationsToday}
            </span>
            <span className="text-xs text-rose-400 font-medium">today</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">First-time signups today</p>
        </div>

        {/* Returning Users Today */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Returning Users</span>
            <Radio className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {telemetry.returningUsersToday}
            </span>
            <span className="text-xs text-sky-400 font-medium">today</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Existing returning athletes</p>
        </div>
      </div>

      {/* 3. Engagement KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-slate-900 border border-cyan-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">DAU / MAU Ratio</span>
            <div className="text-2xl font-bold text-white mt-1">{telemetry.dauMauRatio}%</div>
            <p className="text-xs text-slate-400">User stickiness index</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
            <ArrowUpRight className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Avg Active Time Today</span>
            <div className="text-2xl font-bold text-white mt-1">
              {formatDuration(telemetry.avgActiveTimePerUser)}
            </div>
            <p className="text-xs text-slate-400">Per active athlete today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-slate-900 border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Total Active Time Today</span>
            <div className="text-2xl font-bold text-white mt-1">
              {formatDuration(telemetry.totalActiveSecondsToday)}
            </div>
            <p className="text-xs text-slate-400">Cumulative platform time</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setSubTab('users')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
            subTab === 'users'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Individual User Activity ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('feed')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
            subTab === 'feed'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Real-Time Activity Feed</span>
          {activityFeed.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
              {activityFeed.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('analytics')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
            subTab === 'analytics'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Daily Active Trends</span>
        </button>

        <button
          onClick={() => setSubTab('engagement')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
            subTab === 'engagement'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Engagement & Peak Times</span>
        </button>
      </div>

      {/* 5. TAB 1: Individual User Activity Monitoring */}
      {subTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search athlete by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active (&lt; 5m)</option>
                <option value="Recently Active">Recently Active (5–30m)</option>
                <option value="Offline">Offline (&gt; 30m)</option>
              </select>
            </div>

            {/* Device Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Device:</span>
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Devices</option>
                <option value="Desktop">Desktop</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Tablet">Tablet</option>
              </select>
            </div>
          </div>

          {/* User Activity Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Athlete / Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Active Today</th>
                  <th className="py-3 px-4">Active This Week</th>
                  <th className="py-3 px-4">Sessions Today</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      No matching athletes found for this filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.uid}
                      onClick={() => handleOpenUserHistory(user)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(user.status)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          {renderDeviceIcon(user.device)}
                          <span>{user.device}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                        {formatDuration(user.durationTodaySec)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {formatDuration(user.durationWeekSec)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        {user.sessionsTodayCount}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {formatTimestamp(user.lastActivityTime)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUserHistory(user);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1"
                        >
                          <span>History</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB 2: Real-Time Live Activity Feed */}
      {subTab === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Streaming latest qualifying platform actions in real-time
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Event Trail
            </span>
          </div>

          <div className="divide-y divide-slate-800/70 rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
            {activityFeed.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No activity events logged yet. Events stream here automatically as athletes interact with PlateSync.
              </div>
            ) : (
              activityFeed.map((event) => (
                <div key={event.id || event.eventId} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{event.displayName || 'Athlete'}</span>
                        <span className="text-xs font-mono text-slate-500">({event.userEmail})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {event.eventType}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-0.5">{event.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-slate-400">{formatTimestamp(event.timestamp)}</div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 mt-1">
                      {renderDeviceIcon(event.device)}
                      <span>{event.device}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. TAB 3: Daily Active Analytics & Trend Visualizations */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Date Filter Range
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: '90d', label: 'Last 90 Days' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDateRangeFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    dateRangeFilter === opt.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart 1: Active Users vs New vs Returning */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Daily Active Users: Total vs New vs Returning</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real unique authenticated active athlete counts per calendar day
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} 
                  />
                  <Legend />
                  <Bar dataKey="activeUsers" name="Total Active" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returningUsers" name="Returning Users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newUsers" name="New Registrations" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Total Active Minutes per Day */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Total Recorded Active Time per Day (Minutes)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cumulative verified active duration across all platform sessions
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activeMinsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                    formatter={(val) => [`${val} mins`, 'Active Time']}
                  />
                  <Area type="monotone" dataKey="totalActiveMinutes" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#activeMinsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 4: Engagement Analytics */}
      {subTab === 'engagement' && engagementData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peak Activity Hours */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Peak Activity Hours of the Day (0:00 - 23:00)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">User traffic distribution by hour</p>
              
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} interval={2} />
                    <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8 }} />
                    <Bar dataKey="events" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Active Days of the Week */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Most Active Days of the Week</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">Volume of workouts & sessions by day</p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData.dayOfWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8 }} />
                    <Bar dataKey="events" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Feature Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Feature Usage Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Engagement share across PlateSync modules</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData.featureData} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 9. User Detailed Session History Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
                    {renderStatusBadge(selectedUser.status)}
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Overview Quick Cards */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Today Active</span>
                  <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                    {formatDuration(selectedUser.durationTodaySec)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Device</span>
                  <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                    {renderDeviceIcon(selectedUser.device)}
                    <span>{selectedUser.device}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Sessions</span>
                  <div className="text-base font-bold text-white mt-1">
                    {userSessions.length}
                  </div>
                </div>
              </div>

              {/* Sessions History Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Session History & Interaction Log</span>
                </h3>

                {loadingSessions ? (
                  <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Loading session records...</span>
                  </div>
                ) : userSessions.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                    No recorded session history for this user yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userSessions.map((sess) => (
                      <div
                        key={sess.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">{sess.sessionDate}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sess.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : sess.status === 'Inferred / Interrupted'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                            }`}
                          >
                            {sess.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Start</span>
                            <span className="text-slate-300 font-mono">{formatTimestamp(sess.startTime)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">End</span>
                            <span className="text-slate-300 font-mono">{formatTimestamp(sess.endTime)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Active Time</span>
                            <span className="text-emerald-400 font-mono font-semibold">
                              {formatDuration(sess.activeDurationSec)}
                            </span>
                          </div>
                        </div>

                        {/* Activities list */}
                        {sess.activities && sess.activities.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                              Activities Recorded
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {sess.activities.map((act, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                                >
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
              >
                Close Activity Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveUsersTab;
