import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Lock
} from 'lucide-react';
import { getAuditLogs } from '../../../services/admin/adminDataService';

export const AdminLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs(100, filterAction);
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const filtered = logs.filter(l => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (l.adminEmail && l.adminEmail.toLowerCase().includes(q)) ||
      (l.action && l.action.toLowerCase().includes(q)) ||
      (l.target && l.target.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-midnight-card border border-midnight-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Immutable Audit Protocol
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-neon-cyan" />
            Administrative Security Audit Logs ({logs.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-proof ledger tracking all administrative authentications, privilege grants, and catalog modifications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="pl-9 pr-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-slate-300 text-xs font-semibold focus:outline-none focus:border-neon-cyan"
          >
            <option value="ALL">All Event Types</option>
            <option value="ADMIN_LOGIN">Admin Logins</option>
            <option value="ADMIN_LOGOUT">Admin Logouts</option>
            <option value="EXERCISE_CREATED">Exercises Created</option>
            <option value="EXERCISE_UPDATED">Exercises Updated</option>
            <option value="EXERCISE_DELETED">Exercises Deleted</option>
            <option value="PROGRAM_CREATED">Programs Created</option>
            <option value="USER_STATUS_CHANGE">User Status Changes</option>
            <option value="ADMIN_ROLE_CHANGE">Role Changes</option>
            <option value="PLATFORM_SETTINGS_UPDATED">Settings Updates</option>
          </select>

          <button
            onClick={loadLogs}
            className="p-2 bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 rounded-xl transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4 text-neon-cyan" />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-midnight-border bg-midnight-elevated/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-border/60 text-xs font-mono">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neon-cyan mb-2" />
                    <span>Verifying audit cryptographic log entries...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-bold text-slate-300 font-sans">No matching audit events</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-midnight-elevated/30 transition">
                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-bold text-[10.5px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[11.5px]">
                      {log.adminEmail}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[120px]">
                      {log.target}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.result === 'SUCCESS' ? 'bg-neon-success/15 text-neon-success' : 'bg-rose-500/15 text-rose-300'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {log.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[10.5px] max-w-[200px] truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
