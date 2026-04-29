import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStudent } from "../redux/StudentSlice";
import { setTeacher } from "../redux/TeacherSlice";
import toast from "react-hot-toast";

function Settings() {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student || {});
  const teacher = useSelector((state) => state.teacher || {});
  const user = student.user || teacher.user;
  const role = String(user?.role || "").toLowerCase();

  const initialPrefs = useMemo(
    () => ({
      emailNotifications: user?.preferences?.emailNotifications ?? true,
      darkMode: user?.preferences?.darkMode ?? true,
      profilePublic: user?.preferences?.profilePublic ?? false,
    }),
    [user]
  );

  const [preferences, setPreferences] = useState(initialPrefs);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const pushUser = (nextUser) => {
    if (role === "teacher") dispatch(setTeacher(nextUser));
    else dispatch(setStudent(nextUser));
  };

  const savePreferences = async () => {
    try {
      const res = await fetch("/api/auth/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ preferences }),
      });
      const data = await res.json();
      if (!data.success) return toast.error(data.message || "Save failed");
      pushUser(data.user);
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to update settings");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!data.success) return toast.error(data.message || "Password update failed");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password changed successfully");
    } catch {
      toast.error("Failed to change password");
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
        Settings
      </h1>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { key: "emailNotifications", label: "Email notifications" },
            { key: "darkMode", label: "Dark mode UI" },
            { key: "profilePublic", label: "Public profile" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() =>
                setPreferences((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
              }
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                preferences[item.key]
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-gray-400 mt-2">
                {preferences[item.key] ? "Enabled" : "Disabled"}
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={savePreferences}
          className="mt-5 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-semibold transition-all w-full sm:w-auto"
        >
          Save Preferences
        </button>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <form onSubmit={changePassword} className="grid md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
            }
            className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500"
          />
          <input
            type="password"
            placeholder="New password (min 8)"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="md:col-span-2 w-full sm:w-fit px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition-all"
          >
            Update Password
          </button>
        </form>
      </section>
    </div>
  );
}

export default Settings;
