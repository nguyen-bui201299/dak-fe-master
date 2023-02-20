import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API, { endpoints, headers } from "../../API";

const initialState = {
    status: 'idle', // |'idle' | 'loading' | 'success' | 'failed',
    error: null
}

export const fetchGroup = createAsyncThunk(
    "group/fetchGroup",
    async({limit, page, keyword}) => {
        const res = await API.get(endpoints['findGroup'](limit, page, keyword), {headers: headers.headers_token})
        return res.data.data;
    }
)

export const fetchJoinedGroup = createAsyncThunk(
    "group/fetchJoinedGroup",
    async({limit, page}) => {
        const res = await API.get(endpoints['listJoinGroup'](limit, page), {headers: headers.headers_token});
        return res.data;
    }
)

export const createGroup = createAsyncThunk(
    "group/createGroup",
    async({name, access, desc, avatar, background_img}) => {
        if(background_img === 'null') {
            background_img = ""
        }
        const res = await API.post(
            endpoints['createGroup'], 
            {name, access, desc, avatar, background_img},
            {headers: headers.headers_token}
        )
        return res;
    }
)

export const updateGroup = createAsyncThunk(
    "group/updateGroup",
    async({data}) => {
        const {id, ...getData} = data;
        const res = await API.put(endpoints.getDetailGroup(data.id), getData, {headers: headers.headers_token});
        // console.log(res)
        return res;
    }
)

export const deleteGroup = createAsyncThunk(
    "group/deleteGroup",
    async({data}) => {
        const res = await API.delete(endpoints.deleteGroup,{data: data, headers: headers.headers_token});
        return res;
    }
)

const groupSlice = createSlice({
    'name': 'groups',
    initialState,
    extraReducers(builder) {
        builder
            // Lấy tất cả các nhóm
            .addCase(fetchGroup.fulfilled, (state, action) => {
                console.log('Success')
                state.status = 'success';
            })
            // Lấy các nhóm đã tham gia
            .addCase(fetchJoinedGroup.fulfilled, (state, action) => {
                state.status = 'success';
            })
            // Tạo nhóm
            .addCase(createGroup.fulfilled, (state, action) => {
                state.status = 'success';
            })
            // Cập nhật nhóm
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.status = 'success';
            })
            // Xoá nhóm
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.status = 'success';
            })
    }
})

export default groupSlice.reducer;