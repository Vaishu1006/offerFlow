// pages/admin/AllUsers.jsx
import { useEffect, useState } from "react";
import { getAllUsers, getUserById, deleteUser, updateUser } from "../../api/userApi";
import { useDebounce } from "../../hooks/useDebounce";

const ROLES = ["student", "mentor", "admin"];

const ROLE_BADGE = {
  student: "text-slate border-slate/40 bg-slate/10",
  mentor: "text-teal border-teal/40 bg-teal/10",
  admin: "text-gold border-gold/40 bg-gold/10",
};

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [roleFilter, setRoleFilter] = useState("");
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    load();
  }, [debouncedSearch, roleFilter]);

  async function load() {
    try {
      setLoading(true);
      const res = await getAllUsers({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && { role: roleFilter }),
      });
      if (res.success) {
        setUsers(res.users ?? []);
      } else {
        setError(res.message || "Failed to load users");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id, newRole) {
    try {
      setActionId(id);
      const res = await updateUser(id, { role: newRole });
      console.log("Update response:", res);
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u._id === id ? res.user : u)));
      }
    } catch (err) {
      
    setError(err?.response?.data?.message || "Failed to update role");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user permanently? This cannot be undone.")) return;
    try {
      setActionId(id);
      const res = await deleteUser(id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Users</h1>
        <p className="text-muted text-sm mt-1">{users.length} total</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-panel border border-border rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:border-gold transition"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-panel border border-border rounded-lg px-4 py-2.5 text-text text-sm outline-none focus:border-gold transition"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : error ? (
        <p className="text-coral">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-muted text-sm">No users found.</p>
      ) : (
        <div className="bg-panel border border-border rounded-2xl overflow-hidden">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
            >
              <div>
                <p className="text-text text-sm font-semibold">{u.fullName}</p>
                <p className="text-muted text-xs mt-0.5">{u.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full border ${
                    ROLE_BADGE[u.role] ?? "text-muted border-border"
                  }`}
                >
                  {u.role}
                </span>

                <select
                  value={u.role}
                  disabled={actionId === u._id}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="bg-panel-2 border border-border rounded-lg px-3 py-1.5 text-text text-xs outline-none focus:border-gold transition disabled:opacity-50"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleDelete(u._id)}
                  disabled={actionId === u._id}
                  className="text-coral text-xs hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}