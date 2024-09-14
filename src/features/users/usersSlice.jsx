import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

/* url */
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

/* initialState, name of the array to store, status, error  */
const initialState = {
  users: [], // Make sure the initial state is an array
  status: 'idle',
  error: null,
};

/* fetching the users with url and an async function */
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

/* slice - reducer function for add and delete */
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = 'loading'; // Correct status update
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Update status to 'succeeded'
        state.users = action.payload; // Update users array with the fetched data
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

/* Selector to return all users */
export const selectAllUsers = (state) => state.users.users;

/* select user by id */
export const selectUserById = (state, userId) =>
  state.users.users.find((user) => user.id === userId);

/* reducers export */
export default usersSlice.reducer;
