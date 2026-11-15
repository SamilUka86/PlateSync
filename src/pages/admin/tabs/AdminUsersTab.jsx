import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  UserX, 
  UserCheck, 
  Trash2, 
  Eye, 
  Calendar, 
  Dumbbell, 
  Scale, 
  AlertTriangle, 
  X, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { 
  getAdminUsersList, 
  getAdminUserDetails, 
  setAccountStatus, 
  setUserAdminRole, 
  safeDeleteUserAccount 
} from '../../../services/admin/adminDataService';
import { useAdmin } from '../../../context/AdminContext';
import { useNotification } from '../../../context/NotificationContext';
import { OWNER_EMAIL } from '../../../services/admin/adminAuthService';

export const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // User detail drawer
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modals
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const { isOwner } = useAdmin();
  const { addNotification } = useNotification();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsersList(search, statusFilter);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      addNotification('Could not load athlete records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setLoadingDetails(true);
    try {
      const details = await getAdminUserDetails(user.id);
      setUserDetails(details);
    } catch (err) {
      addNotification('Could not load user profile details.', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'disabled' ? 'active' : 'disabled';
    try {
      await setAccountStatus(user.id, nextStatus);
      addNotification(`Athlete account marked as ${nextStatus}.`, 'success');
      loadUsers();
      if (selectedUser?.id === user.id) {
        setSelectedUser(prev => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      addNotification('Failed to update account status.', 'error');
    }
  };

  const handleAssignRole = async (targetUser, newRole) => {
    setActionSubmitting(true);
    try {
      await setUserAdminRole(targetUser.id, targetUser.email, newRole);
      addNotification(`Privileges updated: ${targetUser.email} is now ${newRole}.`, 'success');
      setRoleModalUser(null);
      loadUsers();
    } catch (err) {
      addNotification(err.message || 'Failed to update privileges.', 'error');
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    setActionSubmitting(true);
    try {
      await safeDeleteUserAccount(deleteModalUser.id, deleteModalUser.email);
      addNotification(`Account and associated records for ${deleteModalUser.email} deleted successfully.`, 'success');
      setDeleteModalUser(null);
      if (selectedUser?.id === deleteModalUser.id) {
        setSelectedUser(null);
      }
      loadUsers();
    } catch (err) {
      addNotification(err.message || 'Could not delete athlete account.', 'error');
    } finally {
      setActionSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-midnight-card border border-midnight-border">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-cyan" />
            Athlete & User Directory ({users.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage authenticated athlete profiles, account permissions, and historical data records
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-slate-300 text-xs font-semibold focus:outline-none focus:border-neon-cyan"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="DISABLED">Disabled Accounts</option>
          </select>

          <button
            type="button"
            onClick={loadUsers}
            className="p-2 bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 rounded-xl transition"
            title="Reload directory"
          >
            <RefreshCw className="w-4 h-4 text-neon-cyan" />
          </button>
        </form>
      </div>

      {/* Users Table Card */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-midnight-border bg-midnight-elevated/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-border/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neon-cyan mb-2" />
                    <span>Loading athlete records...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-bold text-slate-300">No athletes match criteria</p>
                    <p className="text-[11px] text-slate-500 mt-1">Adjust search terms or status filters</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isUserOwner = u.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
                  const roleBadge = isUserOwner ? 'Lead Admin' : (u.role === 'admin' ? 'Admin' : 'Athlete');
                  const isActive = (u.status || 'active') === 'active';

                  return (
                    <tr key={u.id} className="hover:bg-midnight-elevated/30 transition">
                      
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              u.profileImage || 
                              u.photoURL || 
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name || u.displayName || 'user'}`
                            }
                            alt="Avatar"
                            className="w-7 h-7 rounded-full bg-midnight-bg border border-midnight-border object-cover shrink-0"
                          />
                          <span className="font-bold text-white truncate max-w-[140px]">
                            {u.name || u.displayName || 'Athlete'}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-[11.5px] text-slate-300">
                        {u.email || 'N/A'}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                          isUserOwner 
                            ? 'bg-amber-400/15 border border-amber-400/40 text-amber-300'
                            : u.role === 'admin'
                              ? 'bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {roleBadge}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive 
                            ? 'bg-neon-success/15 text-neon-success border border-neon-success/30' 
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-neon-success' : 'bg-rose-500'}`} />
                          {isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewUser(u)}
                            className="p-1.5 rounded-lg bg-midnight-bg hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan border border-midnight-border transition"
                            title="Inspect athlete profile and workout data"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Owner privilege control */}
                          {isOwner && !isUserOwner && (
                            <button
                              onClick={() => setRoleModalUser(u)}
                              className="p-1.5 rounded-lg bg-midnight-bg hover:bg-midnight-elevated text-slate-300 hover:text-amber-400 border border-midnight-border transition"
                              title="Assign / Modify Administrative Role"
                            >
                              <Shield className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Disable / Enable toggle */}
                          {!isUserOwner && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-lg border transition ${
                                isActive 
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30' 
                                  : 'bg-neon-success/10 hover:bg-neon-success/20 text-neon-success border-neon-success/30'
                              }`}
                              title={isActive ? 'Disable account' : 'Re-enable account'}
                            >
                              {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Delete */}
                          {!isUserOwner && (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              className="p-1.5 rounded-lg bg-midnight-bg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-midnight-border transition"
                              title="Safe Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Drawer / Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-midnight-bg hover:bg-midnight-elevated transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={
                  selectedUser.profileImage || 
                  selectedUser.photoURL || 
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedUser.name || 'user'}`
                }
                alt="User"
                className="w-14 h-14 rounded-2xl bg-midnight-bg border border-midnight-border object-cover"
              />
              <div>
                <h3 className="text-lg font-black text-white">
                  {selectedUser.name || selectedUser.displayName || 'Athlete'}
                </h3>
                <p className="text-xs font-mono text-neon-cyan">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>ID: <code className="text-slate-300 font-mono">{selectedUser.id}</code></span>
                  <span>•</span>
                  <span>Preferred: <b className="text-white">{selectedUser.preferredUnit || 'KG'}</b></span>
                </div>
              </div>
            </div>

            {loadingDetails ? (
              <div className="py-12 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neon-cyan mb-2" />
                <span>Aggregating athlete telemetry from Cloud Firestore...</span>
              </div>
            ) : userDetails && (
              <div className="space-y-4">
                
                {/* Stats Summary Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-midnight-bg rounded-2xl border border-midnight-border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Logged Workouts</span>
                    <div className="text-xl font-black text-white font-mono mt-1">
                      {userDetails.workouts?.length || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-midnight-bg rounded-2xl border border-midnight-border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Weight Records</span>
                    <div className="text-xl font-black text-white font-mono mt-1">
                      {userDetails.weightLogs?.length || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-midnight-bg rounded-2xl border border-midnight-border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Personal Records</span>
                    <div className="text-xl font-black text-white font-mono mt-1">
                      {userDetails.personalRecords?.length || 0}
                    </div>
                  </div>
                </div>

                {/* Recent Workouts List */}
                <div className="p-4 bg-midnight-bg rounded-2xl border border-midnight-border space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-neon-cyan" />
                    Recent Logged Sessions ({userDetails.workouts?.length || 0})
                  </h4>
                  {userDetails.workouts?.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">No workouts logged yet.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {userDetails.workouts.slice(0, 5).map((w, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-midnight-card border border-midnight-border/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{w.workoutName || w.title || 'Workout'}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-mono">{w.date || w.createdAt?.split('T')[0]}</span>
                          </div>
                          <span className="text-neon-cyan font-mono text-[11px]">{w.exercises?.length || 0} exercises</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Weight Logs List */}
                <div className="p-4 bg-midnight-bg rounded-2xl border border-midnight-border space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-400" />
                    Recent Body Weight History
                  </h4>
                  {userDetails.weightLogs?.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">No body weight logs recorded.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {userDetails.weightLogs.slice(0, 4).map((wl, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-midnight-card border border-midnight-border/60 text-center">
                          <span className="text-[10px] text-slate-500 font-mono block">{wl.date}</span>
                          <span className="text-xs font-bold text-white font-mono">{wl.weight} {wl.unit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Assignment Modal (Owner Only) */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Administrative Permissions
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select platform role for <span className="text-white font-bold">{roleModalUser.email}</span>.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAssignRole(roleModalUser, 'admin')}
                disabled={actionSubmitting}
                className="w-full p-3 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-xs font-bold text-left transition"
              >
                Assign Administrator (Full Admin Suite Access)
              </button>

              <button
                type="button"
                onClick={() => handleAssignRole(roleModalUser, 'athlete')}
                disabled={actionSubmitting}
                className="w-full p-3 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 text-xs font-bold text-left transition"
              >
                Revoke Admin (Standard Athlete Access Only)
              </button>
            </div>

            <button
              onClick={() => setRoleModalUser(null)}
              className="w-full mt-4 py-2 bg-midnight-bg text-slate-400 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Safe Account Deletion Confirmation Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-midnight-card border border-rose-500/40 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-black text-white">Confirm Athlete Account Deletion</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              You are about to permanently delete the account for <span className="font-bold text-white">{deleteModalUser.email}</span>.
            </p>

            <div className="p-3.5 rounded-2xl bg-midnight-bg border border-rose-500/20 text-[11px] text-slate-400 space-y-1.5 mb-4">
              <p className="font-bold text-rose-300">The following data will be permanently wiped:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Cloud Firestore Athlete Profile</li>
                <li>All logged workout sessions & set logs</li>
                <li>All saved barbell & plate calculator configurations</li>
                <li>All Personal Records (PRs) & milestone data</li>
                <li>All body weight progression records</li>
                <li>7-day weekly planner routines</li>
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="flex-1 py-2.5 bg-midnight-bg text-slate-300 rounded-xl text-xs font-bold hover:bg-midnight-elevated"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionSubmitting}
                onClick={handleDeleteUser}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
              >
                {actionSubmitting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
