import { createSlice } from '@reduxjs/toolkit';

const StudentSlice = createSlice({
    name: 'Student',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true,
    },
    reducers: {
        setStudent(state, action) {
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
        setdata(state, action) {
            state.data = action.payload;
        },
        starttrial(state, action) {
if (state.user) {
                state.user.plan = action.payload.plan;
                state.user.trialEndDate = action.payload.trialEndDate;
                state.user.isTrialUsed = action.payload.isTrialUsed;
            }    },
    
    },
});

export const { setStudent, logout, setLoading,starttrial} = StudentSlice.actions;
export default StudentSlice.reducer;