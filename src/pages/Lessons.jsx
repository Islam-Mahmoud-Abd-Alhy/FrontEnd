import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setStudent } from "../redux/StudentSlice";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

function Lessons() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.student);
  const [courseCode, setCourseCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

 useEffect(() => {
  const fetchProfile = async () => {
    if (user) return; 

    try {
      dispatch(setLoading(true)); 
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      
      if (data.success) {
        dispatch(setStudent(data.user)); 
      }
    } catch {
      console.error("Auth failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  fetchProfile();
}, [dispatch, user]);
const handleJoinCourse = async (e) => {
  e.preventDefault();
  if (!courseCode.trim()) return toast.error("Enter the code!");

  setIsJoining(true);
  try {
    const res = await fetch("/api/courses/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessCode: courseCode }),
    });
    
    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setStudent(data.user)); 
      setCourseCode("");
    } else {
      toast.error(data.message);
    }
  } catch {
    toast.error("Connection Error");
  } finally {
    setIsJoining(false);
  }
};
const handleLeaveCourse = async (courseId) => {
  if (!courseId) return toast.error("Course ID is missing!");

  if (!window.confirm("Are you sure you want to leave?")) return;

  try {
    const res = await fetch(`/api/courses/leave/${courseId}`, {
      method: "DELETE", 
    });
    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setStudent(data.user)); 
    } else {
      toast.error(data.message);
    }
  } catch {
    toast.error("Failed to leave course");
  }
};
  if (loading) return <div className="text-cyan-500 p-10 font-mono">Command Checking...</div>;
  return (

  <div className="p-0 sm:p-2 lg:p-4 text-white min-h-screen">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
          My Learning Path
        </h1>
        <p className="text-gray-500 font-mono mt-2 uppercase tracking-widest text-xs">
           Student / Environment
        </p>
      </div>

      <form onSubmit={handleJoinCourse} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <input 
          className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500 transition-all font-mono uppercase text-sm w-full md:w-48"
          placeholder="ENTER COURSE CODE"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <button 
          disabled={isJoining}
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold transition-all disabled:bg-gray-700 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {isJoining ? "Joining..." : "Join"}
        </button>
      </form>
    </div>

    {!user?.enrolledCourses?.length ? (
      <div className="border-2 border-dashed border-white/5 p-8 sm:p-20 text-center rounded-3xl sm:rounded-[3rem] bg-white/[0.01]">
        <p className="text-gray-500 font-mono">No active courses. Enter a code above to start.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.enrolledCourses.map((course) => (
          <div 
            key={course._id} 
            className="group relative bg-white/5 border border-white/10 p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
               <div className="w-12 h-12 bg-cyan-500 rounded-full blur-2xl"></div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors break-words pr-8">
              {course.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
              {course.description}
            </p>
            
            <button 
      onClick={() => handleLeaveCourse(course._id)}
      className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-colors"
      title="Leave Course"
    >
      <LogOut size={18} />
    </button>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}

export default Lessons;