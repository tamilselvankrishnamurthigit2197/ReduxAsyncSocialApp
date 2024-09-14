import { createEntityAdapter, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';

/* url */
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

/* localecompare */
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

/* initial State */
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
  count: 0,
});

/* fetching */
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

/* add new posts : fetching 'post' with initial post */
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  const response = await axios.post(POSTS_URL, initialPost);
  return response.data;
});


/* update : put, using specific id */
export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
  const { id } = initialPost;
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost, { rejectWithValue }); // Include id in the URL
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

/* delete: using specific id */
export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
  const { id } = initialPost;
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    if (response?.status === 200) {
      return initialPost;
    }
  } catch (error) {
    return error.message;
  }
});

/* slice functions for Posts */
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    rectionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state, action) {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsup: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        const sortedPosts = Object.values(state.entities).sort((a, b) => {
          if (a.id > b.id) return 1;
          if (b.id > a.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString(); // Call toISOString() method
        action.payload.reactions = {
          thumbsup: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.updateOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload) {
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

/* outside of postsSlice */
export const {
  selectAll: selectAllPosts,
  selectById: selectPostsById,
  selectIds: selectPostsIds,
} = postsAdapter.getSelectors((state) => state.posts);

/* selectpostsByUser */
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

/* status, error, count,.. initialstate export */
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

/* actions of reducer slice and export reducer */
export const { rectionAdded, increaseCount } = postsSlice.actions;
export default postsSlice.reducer;
