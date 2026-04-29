import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStudent } from '../redux/StudentSlice';
import { setTeacher } from '../redux/TeacherSlice';
import toast from 'react-hot-toast';

function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [importance,setimportance] = useState("easy")

  const dispatch = useDispatch();
  const student = useSelector((state) => state.student || {});
  const teacher = useSelector((state) => state.teacher || {});
  const user = student.user || teacher.user;
  const role = String(user?.role || "").toLowerCase();

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        if (data.user.role === "teacher") {
          dispatch(setTeacher(data.user));
        } else {
          dispatch(setStudent(data.user));
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/add-tasks`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title, 
            status, 
            description,
            importance:importance
        }),
        credentials: 'include'
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Task added successfully!');
        setIsModalOpen(false);
        
        const newTask = data.task; 

  if (newTask) {
    const updatedTasks = [...(user?.tasks || []), newTask];
    if (role === "teacher") {
      dispatch(setTeacher({ ...user, tasks: updatedTasks }));
    } else {
      dispatch(setStudent({ ...user, tasks: updatedTasks }));
    }
  }
        
        setTitle(''); setStatus('pending'); setDescription(''); setimportance('easy');
      } else {
        toast.error(data.message || 'Failed to add task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('An error occurred.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Abort this mission?")) return;
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/delete/${taskId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Task Purged!");
            if (role === "teacher") {
              dispatch(setTeacher(data.user));
            } else {
              dispatch(setStudent(data.user));
            }
        }
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className='flex flex-col gap-10 justify-start '>
      <div className='flex flex-col sm:flex-row justify-between sm:items-center px-0 sm:px-4 lg:px-8 pt-2 sm:pt-5 gap-4'>
        <div>
            <h1 className='text-cyan-500 font-bold text-2xl sm:text-3xl tracking-tight'>Commands </h1>
            <p className='text-gray-500 text-sm mt-1'>Manage your security missions</p>
        </div>
        <button 
          className='bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20 active:scale-95 cursor-pointer w-full sm:w-auto' 
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Task
        </button>
      </div>

      <div className='mx-0 sm:mx-4 lg:mx-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl min-h-100 flex flex-col p-4 sm:p-6 lg:p-8'>
        {user?.tasks  ? (
          <ul className='flex flex-col gap-4'>
            {user.tasks.map((task, index) => (
              <li 
                key={task._id || index} 
                className='bg-white/5 border-l-4 border-indigo-600 p-4 sm:p-5 rounded-r-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-white/8 transition-all group'
              >
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors break-words'>{task.title}</h3>
                    <span className='text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase font-mono'>
                        {task.status || 'Pending'}
                    </span>
                  </div>
    <p className='text-gray-400 text-sm max-w-2xl'>{task.discerption || task.description}</p>
    {task.importance && (
      <p className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono text-center w-20 text-white border border-white/10 ${
        task.importance.toLowerCase() === 'hard' ? 'bg-red-800' : 
        task.importance.toLowerCase() === 'medium' ? 'bg-yellow-600' : 
        'bg-green-800'
      }`}>
        {task.importance}
      </p>
    )}
  </div>
                
                <div className='flex items-center gap-4 w-full md:w-auto'>
                  <button onClick={() => handleDelete(task._id)} className="text-white transition-colors bg-red-600 p-3 rounded-2xl w-full md:w-30 hover:bg-red-300">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className='m-auto text-center py-20'>
            <div className='text-6xl mb-4 opacity-20'>🛡️</div>
            <p className='text-gray-500 text-xl font-medium'>No active tasks. Deploy a new mission!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4'>
          <div className='bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl'>
            <h2 className='text-2xl font-bold mb-6 text-indigo-400'>New Mission</h2>
            <form onSubmit={handleAddTask} className='flex flex-col gap-5'>
              <div className='flex flex-col gap-2'>
                <label className='text-xs text-gray-500 font-mono ml-1'>TASK TITLE</label>
                <input 
                  type="text" placeholder="e.g. SQL Injection Lab" required
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  className='bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 text-white transition-all'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs text-gray-500 font-mono ml-1'>TASK STATUS</label>
                <select 
                  value={status} onChange={(e) => setStatus(e.target.value)}
                  className='bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 text-white transition-all'
                >
                  <option value="pending" className='text-indigo-600'>Pending</option>
                  <option value="completed" className='text-indigo-600'>Completed</option>
                </select>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs text-gray-500 font-mono ml-1'>TASK Importance</label>
                <input 
                  type="text" placeholder="easy"
                  value={importance} onChange={(e) => setimportance(e.target.value.toLowerCase())}
                  className='bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 text-white transition-all'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs text-gray-500 font-mono ml-1'>MISSION DETAILS</label>
                <textarea 
                  placeholder="What needs to be done?"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className='bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 h-25 resize-none text-white transition-all'
                />
              </div>
              <div className='flex gap-3 mt-4'>
                <button type="button" onClick={() => setIsModalOpen(false)} className='flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-xl font-bold transition-all'>Abort</button>
                <button type="submit" className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all'>Deploy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;