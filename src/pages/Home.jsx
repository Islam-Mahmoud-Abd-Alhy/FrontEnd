import { useSelector} from 'react-redux'; 
import { Navigate,Link } from 'react-router-dom';

function Home() {
const student = useSelector((state) => state.student || {});
const teacher = useSelector((state) => state.teacher || {});
const user = student.user || teacher.user;
const latesttasks = user?.tasks ? user.tasks.slice(0, 3) : [];
  if (!user) return null;
  return (
    <div className='flex flex-col justify-start items-start gap-5 relative font-tech min-h-full w-full'>
  <div className="absolute top-0 left-[-10%] w-44 h-44 sm:w-60 sm:h-60 bg-cyan-700/50 rounded-full blur-[120px] sm:blur-[150px]"></div>
  <div className='w-full text-start'>
  <p className='text-[#69DAFF] text-[10px] mb-5'>SYSTEM_DASHBOARD_LIVE</p>
  <h1 className='text-start text-white font-extrabold text-3xl sm:text-4xl lg:text-6xl max-w-4xl'>Command your <span className='text-cyan-400'>Technical</span> <span className='text-cyan-400'>Evolution .</span></h1>
  <p className='text-gray-400 text-sm sm:text-base lg:text-lg mt-4 max-w-3xl'>Select a core vector to begin your high-intensity training. Each track is designed
for elite-level proficiency in modern digital warfare.</p>
    </div>
    <div className='bg-[#262625] p-4 sm:p-5 mt-6 sm:mt-10 rounded-lg w-full h-auto flex flex-col justify-start items-start gap-3'>
<p className='text-white text-xl sm:text-2xl'>Your Tasks :</p>
<div>
{latesttasks.length === 0 ? (
  <p className='text-gray-400'>No tasks assigned yet. Check back later for your next mission.</p>
) : (
  <ul className='flex flex-col gap-2'>
    {latesttasks.map((task) => (
      <li key={task._id} className='bg-[#1E1E1E] p-4 sm:p-5 rounded-md flex justify-between gap-3 sm:gap-4 items-start sm:items-center w-full flex-col sm:flex-row'>
        <div className='min-w-0'>
          <p className='text-white font-medium'>{task.title}</p>
          <p className='text-gray-400 text-sm'>{new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
        <span className='shrink-0'>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${task.importance === 'easy' ? 'bg-green-500 text-white' : task.importance === 'medium' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
            {task.importance.slice(0)}
          </span>
        </span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${task.status === 'pending' ? 'bg-yellow-500 text-white' : task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </li>
    ))}
    <Link to="/dashboard/tasks">
      <button className='bg-cyan-500 p-2 text-white w-full hover:bg-cyan-600 rounded-md transition-all cursor-pointer'>
        View All Tasks
      </button>
    </Link>
  </ul>
)}
</div>
    </div>
    </div>
  )
}

export default Home
