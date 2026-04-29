import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link, Outlet } from "react-router-dom";
import {
  Home,
  CheckSquare,
  User,
  Settings,
  LogOut,
  CreditCard,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading as setStudentLoading, setStudent } from "../redux/StudentSlice";
import { setLoading as setTeacherLoading, setTeacher } from "../redux/TeacherSlice";
import { useState } from "react";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector((state) => state.student || {});
  const teacher = useSelector((state) => state.teacher || {});
  const user = student.user || teacher.user;
  const authLoading = Boolean(student.loading || teacher.loading);
  const role = String(user?.role || "").toLowerCase();
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setTeacherLoading(true));
      dispatch(setStudentLoading(true));
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.user.role === "student") {
          dispatch(setStudent(data.user));
        } else if (data.success && data.user.role === "teacher") {
          dispatch(setTeacher(data.user));
        } else {
          dispatch(setTeacher(null));
          dispatch(setStudent(null));
        }
      } catch {
        console.log("Not logged in");
        dispatch(setTeacher(null));
        dispatch(setStudent(null));
      } finally {
        dispatch(setTeacherLoading(false));
        dispatch(setStudentLoading(false));
      }
    };

    if (!user) checkAuth();
  }, [dispatch, user, navigate]);
  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        dispatch(setStudent(null));
        dispatch(setTeacher(null));
        navigate("/login");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
    }
  };
  if (authLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 font-bold text-2xl animate-pulse">
          ShieldByte Checking...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex overflow-x-hidden font-tech relative">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-72 sm:w-80 h-screen bg-[#020202] text-white flex flex-col z-40 fixed lg:static top-0 left-0 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-8 flex start gap-3 flex-col">
          <h2 className="text-white font-bold text-md mb-5 text-center">
            GLOBAL TECH ACADEMY
          </h2>
          <div className="flex flex-row gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 40 32"
              fill="none"
              className="p-3 bg-[#00cefc52] rounded-xl shadow-[0_0_15px_rgba(0,206,252,0.5)] transition-all hover:scale-110 w-15"
            >
              <path
                d="M4 32C2.9 32 1.95833 31.6083 1.175 30.825C0.391667 30.0417 0 29.1 0 28V4C0 2.9 0.391667 1.95833 1.175 1.175C1.95833 0.391667 2.9 0 4 0H36C37.1 0 38.0417 0.391667 38.825 1.175C39.6083 1.95833 40 2.9 40 4V28C40 29.1 39.6083 30.0417 38.825 30.825C38.0417 31.6083 37.1 32 36 32H4V32M4 28H36V28V28V8H4V28V28V28V28M11 26L8.2 23.2L13.35 18L8.15 12.8L11 10L19 18L11 26V26M20 26V22H32V26H20V26"
                fill="#69DAFF"
              />
            </svg>
            <div>
              <h2 className="font-bold">COMMAND</h2>
              <p className="font-bold text-[#ADAAAA] text-[12px]">
                ACADEMY_OS_V1
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col px-4 pb-4 overflow-y-auto">
          <h2 className="font-bold text-[#818080] mb-2">Main Stack</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-4 hover:bg-white/10 transition-all hover:border-l-6 border-[#69DAFF] group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home className="w-5 h-5 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/tasks"
                className="flex items-center gap-3 p-4 hover:bg-white/10 transition-all hover:border-l-6 border-[#69DAFF] group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <CheckSquare className="w-5 h-5 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
                <span className="font-medium">Tasks</span>
              </Link>
            </li>
            <li className="cursor-not-allowed">
              <Link
                to="/dashboard/subscription"
                className="flex items-center gap-3 p-4 bg-gray-900/20 pointer-events-none transition-all border-l-6 border-transparent group"
                onClick={(e) => e.preventDefault()}
              >
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-500">Subscription</span>
              </Link>
            </li>
            {isStudent && (
              <li>
              <Link
                to="/dashboard/lessons"
                className="flex items-center gap-3 p-4 hover:bg-white/10 transition-all hover:border-l-6 border-[#69DAFF] group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Zap className="w-5 h-5 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
                <span className="font-medium">Lessons</span>
              </Link>
            </li>
            )}
            {isTeacher && (
              <li>
                <Link
                  to="/dashboard/courses"
                  className="flex items-center gap-3 p-4 hover:bg-white/10 transition-all hover:border-l-6 border-[#69DAFF] group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Zap className="w-5 h-5 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
                  <span className="font-medium">Courses</span>
                </Link>
              </li>
            )}
          </ul>
          <ul className="mt-4 space-y-1 border-t border-white/10 pt-4">
            <li>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 p-4 hover:bg-white/10 transition-all hover:border-l-6 border-[#69DAFF] group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Settings className="w-5 h-5 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
            <li
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/20 transition-all hover:text-red-400 cursor-pointer text-gray-400"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
              <span className="font-medium">Logout</span>
            </li>
          </ul>
          <div className="p-2 border border-white/10 mt-4 bg-black/30 rounded-2xl">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-lg transition-all group"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10">
                <User className="w-6 h-6 group-hover:text-[#69DAFF] transition-transform ease-in-out group-hover:scale-115" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="font-semibold text-gray-100 text-sm truncate">
                  {user ? user.name : "Guest"}
                </p>
                <p className="text-xs text-gray-500">{role || "guest"}</p>
              </div>
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-[#050505]">
        <div className="sticky top-0 z-20 lg:hidden bg-[#050505]/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg border border-white/20 text-white"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-sm text-gray-300 truncate">
            {user ? user.name : "Dashboard"}
          </p>
        </div>
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
