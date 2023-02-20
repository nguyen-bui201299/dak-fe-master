import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API, { endpoints, headers } from "../../API";

const initialState = {
    status: 'idle', // |'idle' | 'loading' | 'success' | 'failed',
    error: null
}

// State post data hiện chưa được sử dụng trong redux toolkit.
// File này chỉ bao gồm các chức năng gọi các chức năng để tương tác với db từ phía BE về.

export const fetchPostThunk = createAsyncThunk(
    "post/fetchPost",
    async ({ userId, limitPage, currentPage }) => {
        const res = await API.get(endpoints["getListPostProfile"](userId, limitPage, currentPage), {
            headers: headers.headers_token,
        })
        return res
    }
)

export const createPostThunk = createAsyncThunk(
    "post/createPost",
    async ({link, status, permission, friends}) => {
        const res = await API.post(
            endpoints['createPost'],
            {
              post_url: link,
              caption: status,
              post_access: permission,
              friends: friends,
            },
            { headers: headers.headers_token }
          )

        return res.data
    }
)

export const createPostGroupThunk = createAsyncThunk(
    "post/createPostGroup",
    async ({link, status, permission, friends,id}) => {
        const res = await API.post(
            endpoints.createPostGroup(id),
            {
              post_url: link,
              caption: status,
              post_access: permission,
              friends: friends,
            },
            { headers: headers.headers_token }
          )

        return res.data
    }
)

export const deletePostThunk = createAsyncThunk(
    "post/deletePost",
    async ({ id }) => {
        const res = await API.delete(endpoints.deletePost, {
            data: { post_id: id },
            headers: headers.headers_token,
          })

        return {data: res.data, post_id: id}
    }
)

export const updatePostThunk = createAsyncThunk(
    "post/updatePost",
    async ({ data }) => {
        const res = await API.put(endpoints['updatePost'], data, { headers: headers.headers_token })
        return res;
    }
)

const postSlice = createSlice({
    'name': 'posts',
    initialState,
    // extraReducers(builder) {
    //     builder
    //         // Lấy bài viết
    //         .addCase(fetchPostThunk.fulfilled, (state, action) => {
    //             state.status = 'success';
    //         })
    //         // Tạo bài viết
    //         .addCase(createPostThunk.fulfilled, (state, action) => {
    //             state.status = 'success';
    //         })
    //         // Xóa bài viết
    //         .addCase(deletePostThunk.fulfilled, (state, action) => {
    //             state.status = 'success';
    //         })
    //         // Cập nhật bài viết
    //         .addCase(updatePostThunk.fulfilled), (state, action) => {
    //             state.status = 'success';
    //         }
    // }
})


export default postSlice.reducer;

export const selectAllPosts = state => state.posts;

export const selectPostById = (state, postId) => state.posts.find(post => post.id === postId)

// Pattern for Redux toolkit reducers
// [createPostThunk.pending]: (state, action) => {
//     state.loading = true;
// },
// [createPostThunk.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.posts = state.posts.concat(action.payload);
//     console.log(state.posts)
// },
// [createPostThunk.rejected]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload.message;
// },