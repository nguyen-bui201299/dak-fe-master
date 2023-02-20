import {createSlice} from '@reduxjs/toolkit'

const fetch = createSlice({
    name: 'fetchlottery',
    initialState: {},
    reducers:{
        addTicket: (state, action)=>{
            const newState = action.payload;
            return newState;
        }
    }
})

const {reducer, actions} = fetch;
export const {addTicket}=actions;
export default reducer;