// pages/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, changePassword } from "../api/userApi";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");
    setSavingProfile(true);

    try {
      const res = await updateProfile({ fullName });
      if (res.success) {
        setProfileMsg("Profile updated successfully.");
      } else {
        setProfileErr(res.message || "Failed to update profile");
      }
    } catch (err) {
      setProfileErr(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordErr("");
    setPasswordMsg("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordErr("New password and confirm password do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (res.success) {
        setPasswordMsg("Password updated successfully.");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordErr(res.message || "Failed to update password");
      }
    } catch (err) {
      setPasswordErr(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-text mb-6">Profile</h1>

      {/* Personal details */}
      <h2 className="text-text font-semibold mb-3">Personal details</h2>
      <form
        onSubmit={handleSaveProfile}
        className="bg-panel border border-border rounded-2xl p-6 space-y-4 mb-8"
      >
        <div>
          <label className="block text-sm text-muted mb-1.5">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text outline-none focus:ring-2 focus:ring-gold/30 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full bg-panel-2 border border-border rounded-lg px-4 py-2.5 text-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Phone</label>
          <input
            type="tel"
            placeholder="Optional"
            disabled
            className="w-full bg-panel-2 border border-border rounded-lg px-4 py-2.5 text-muted placeholder-muted cursor-not-allowed"
          />
        </div>

        {profileErr && <p className="text-coral text-xs">{profileErr}</p>}
        {profileMsg && <p className="text-teal text-xs">{profileMsg}</p>}

        <button
          type="submit"
          disabled={savingProfile}
          className="bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm px-5 py-2.5 rounded-lg transition"
        >
          {savingProfile ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Change password */}
      <h2 className="text-text font-semibold mb-3">Change password</h2>
      <form
        onSubmit={handleChangePassword}
        className="bg-panel border border-border rounded-2xl p-6 space-y-4 mb-8"
      >
        <div>
          <label className="block text-sm text-muted mb-1.5">Current password</label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
            required
            className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text outline-none focus:ring-2 focus:ring-gold/30 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">New password</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            required
            minLength={6}
            className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text outline-none focus:ring-2 focus:ring-gold/30 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Confirm new password</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
            required
            minLength={6}
            className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text outline-none focus:ring-2 focus:ring-gold/30 transition"
          />
        </div>

        {passwordErr && <p className="text-coral text-xs">{passwordErr}</p>}
        {passwordMsg && <p className="text-teal text-xs">{passwordMsg}</p>}

        <button
          type="submit"
          disabled={savingPassword}
          className="bg-gold hover:opacity-90 disabled:opacity-60 text-gold-ink font-semibold text-sm px-5 py-2.5 rounded-lg transition"
        >
          {savingPassword ? "Updating..." : "Update password"}
        </button>
      </form>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-coral text-sm font-medium hover:underline"
      >
        Log out
      </button>
    </div>
  );
}