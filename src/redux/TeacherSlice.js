import { createSlice } from '@reduxjs/toolkit';

const TeacherSlice = createSlice({
    name: 'Teacher',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true,
    },
    reducers: {
        setTeacher(state, action) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setDate(state, action) {
            state.data = action.payload;
        },
    },
});

export const { setTeacher, logout, setLoading, setDate } = TeacherSlice.actions;
export default TeacherSlice.reducer;