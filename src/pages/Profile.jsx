import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading as setStudentLoading,
  setStudent,
} from "../redux/StudentSlice";
import {
  setLoading as setTeacherLoading,
  setTeacher,
} from "../redux/TeacherSlice";
import { useState, useEffect } from "react";
import { User, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
function Profile() {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student || {});
  const teacher = useSelector((state) => state.teacher || {});
  const user = student.user || teacher.user;
  const authLoading = Boolean(student.loading || teacher.loading);
  const role = String(user?.role || "").toLowerCase();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) return;

      dispatch(setStudentLoading(true));
      dispatch(setTeacherLoading(true));

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          if (data.user.role === "teacher") {
            dispatch(setTeacher(data.user));
            dispatch(setTeacherLoading(false));
          } else if (data.user.role === "student") {
            dispatch(setStudent(data.user));
            dispatch(setStudentLoading(false));
          }
        } else {
          dispatch(setTeacher(null));
          dispatch(setStudent(null));
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      } finally {
        dispatch(setStudentLoading(false));
        dispatch(setTeacherLoading(false));
      }
    };

    fetchProfile();
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
    });
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success && role === "teacher") {
        dispatch(setTeacher(data.user));
        toast.success("Profile updated successfully");
      } else if (data.success && role === "student") {
        dispatch(setStudent(data.user));
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while updating the profile");
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 font-bold text-2xl animate-pulse">
          Command  Checking...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-5 justify-start items-center align-start w-full h-full flex-1">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 bg-linear-to-tr from-cyan-500 to-blue-300 text-transparent bg-clip-text text-center sm:text-left">
        Profile & Account
      </h1>
      <section className="w-full max-w-5xl grid lg:grid-cols-[300px,1fr] gap-4 sm:gap-6 text-white">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-900/20">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 mb-4">
            <User className="w-7 h-7 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold break-words">{user.name}</p>
          <p className="text-gray-400 mt-1 break-all">{user.email}</p>
          <p className="mt-4 inline-flex px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm">
            {role}
          </p>
          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Account secured by cookie auth</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> {user.email}</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-400" /> {user.phone || "No phone yet"}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /> {user.location || "No location yet"}</p>
          </div>
        </div>
        <form className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-900/20" onSubmit={updateProfile}>
          <h2 className="text-xl font-bold mb-6 text-cyan-300">Edit account info</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 font-mono ml-1">NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 font-mono ml-1">EMAIL</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 font-mono ml-1">PHONE</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 font-mono ml-1">LOCATION</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs text-gray-500 font-mono ml-1">BIO</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500 h-24 resize-none text-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-cyan-600/20 transition-all"
          >
            Save Changes
          </button>
        </form>
      </section>
    </div>
  );
}

export default Profile;
