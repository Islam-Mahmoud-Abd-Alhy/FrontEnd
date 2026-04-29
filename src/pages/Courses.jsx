import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTeacher } from "../redux/TeacherSlice";
import { PlusCircle, Code, Trash2, Users, X, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

function Courses() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.teacher);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    accessCode: "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Course Created!");
        dispatch(setTeacher(data.user));
        setFormData({ title: "", description: "", accessCode: "" });
        setShowModal(false); 
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure? This will remove the course for everyone!")) return;
    try {
      const res = await fetch(`/api/courses/delete/${courseId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        dispatch(setTeacher(data.user)); 
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-2 lg:p-6 animate-in fade-in duration-700">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 sm:mb-12 gap-4 sm:gap-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Course Management</h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-tighter"> Teacher / Control-Panel</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/20 w-full sm:w-auto"
        >
          <PlusCircle size={20} /> Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.courses?.length > 0 ? (
          user.courses.map((course) => (
            <div key={course._id} className="group relative bg-white/5 border border-white/10 p-5 sm:p-6 rounded-3xl sm:rounded-[2.5rem] hover:border-cyan-500/40 transition-all duration-500 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-cyan-500/10 transition-colors">
                  <Code className="text-cyan-500" size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(course._id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 break-words">{course.title}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users size={16} className="text-cyan-500" />
                  <span>{course.students?.length || 0} Students</span>
                </div>
                <span className="font-mono text-xs bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full border border-cyan-500/20">
                  {course.accessCode}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 sm:py-20 text-center border-2 border-dashed border-white/5 rounded-3xl sm:rounded-[3rem]">
            <p className="text-gray-500 font-mono italic">No courses deployed yet. Launch your first one!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#121212] border border-white/10 w-full max-w-2xl rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <PlusCircle className="text-cyan-500" /> Construct New Course
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm ml-2">Course Title</label>
                <input 
                  type="text" required placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 text-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm ml-2">Access Code</label>
                <input 
                  type="text" required placeholder="Code"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({...formData, accessCode: e.target.value.toUpperCase()})}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 text-white transition-all uppercase"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-gray-400 text-sm ml-2">Description</label>
                <textarea 
                  rows="3" required placeholder="About this course..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 text-white transition-all resize-none"
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="md:col-span-2 bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-cyan-600/20"
              >
                {loading ? "Deploying..." : "Launch Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;