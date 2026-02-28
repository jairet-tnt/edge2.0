"use client";

import { useState } from "react";
import { UserCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProfilePage() {
  const [username, setUsername] = useState("John Smith");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-brandBlue focus:border-transparent";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-lg">

        {/* ── Profile info ── */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-5">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Profile</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-lightGrey border-2 border-gray-200 flex items-center justify-center mb-3">
              <UserCircle className="w-16 h-16 text-gray-400" />
            </div>
            <button className="text-xs text-brand-brandBlue hover:underline">
              Change photo
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-brand-brandBlue text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {saved ? "Saved!" : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Change password ── */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Change Password</h2>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={inputClass}
              />
            </div>
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-brand-accentRed text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {pwSaved ? "Password Updated!" : "Update Password"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
