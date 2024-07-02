import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { createNotification } from "./notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      const blog = action.payload;
      return state.filter((b) => b.id !== blog.id);
    },
    updateBlog(state, action) {
      const blog = action.payload;
      return state.map((b) => (b.id === blog.id ? blog : b));
    },
  },
});
const { setBlogs, appendBlog, removeBlog, updateBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject, user, blogFormRef) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blogObject);
      newBlog.user = user;
      dispatch(appendBlog(newBlog));
      dispatch(
        createNotification({
          message: `New Blog ${blogObject.title} by ${blogObject.author} added`,
        })
      );
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      dispatch(
        createNotification({ message: error.response.data.error, error: true })
      );
    }
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id);
      dispatch(createNotification({ message: `${blog.title} deleted` }));
      dispatch(removeBlog(blog));
    } catch (exception) {
      dispatch(
        createNotification({
          message: exception.response.data.error,
          error: true,
        })
      );
    }
  };
};

export const addLike = (blog) => {
  return async (dispatch) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      await blogService.updateBlog(likedBlog);

      dispatch(updateBlog(likedBlog));
    } catch (exception) {
      console.log(exception);
    }
  };
};

export const addComment = (blog, comment) => {
  return async (dispatch) => {
    const commentedBlog = { ...blog, comments: blog.comments.concat(comment) };
    try {
      await blogService.addComment(blog.id, comment);
      dispatch(updateBlog(commentedBlog));
    } catch (exception) {
      console.log(exception);
    }
  };
};

export default blogSlice.reducer;
