import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setLoading as setStudentLoading,
  setStudent,
} from "../src/redux/StudentSlice";
import {
  setLoading as setTeacherLoading,
  setTeacher,
} from "../src/redux/TeacherSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Lessons from "../src/pages/Lessons";
import Courses from "./pages/Courses";

const FullScreenLoader = () => (
  <div className="h-screen bg-black flex items-center justify-center">
    <div className="text-cyan-500 font-bold text-2xl animate-pulse">
      Command Checking...
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student || {});
  const teacher = useSelector((state) => state.teacher || {});

  const user = student.user || teacher.user || null;
  const authLoading = Boolean(student.loading || teacher.loading);
  useEffect(() => {const checkAuth = async () => {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();

    if (data.success) {
      console.log("User data on reload:", data.user.tasks); 
      
      if (data.user.role === "teacher") {
        dispatch(setTeacher(data.user));
      } else {
        dispatch(setStudent(data.user));
      }
    }
  } catch (error) {
    console.error("Auth check failed", error);
  } finally {
    dispatch(setStudentLoading(false));
    dispatch(setTeacherLoading(false));
  }
};

    checkAuth();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              authLoading ? (
                <FullScreenLoader />
              ) : !user ? (
                <Login />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              authLoading ? (
                <FullScreenLoader />
              ) : !user ? (
                <Signup />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              authLoading ? (
                <FullScreenLoader />
              ) : user ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" state={{ from: "dashboard" }} replace />
              )
            }
          >
            {" "}
            <Route index element={<Home />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="courses" element={<Courses />} />
          </Route>

          <Route
            path="/"
            element={
              authLoading ? (
                <FullScreenLoader />
              ) : (
                <Navigate to={user ? "/dashboard" : "/login"} replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
