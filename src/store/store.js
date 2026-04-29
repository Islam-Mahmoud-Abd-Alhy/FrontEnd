import { configureStore } from '@reduxjs/toolkit';
import studentReducer from '../redux/StudentSlice';
import teacherReducer from '../redux/TeacherSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer, 
    teacher: teacherReducer, 
  },
});