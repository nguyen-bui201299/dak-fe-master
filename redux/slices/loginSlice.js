import { createSlice } from "@reduxjs/toolkit";

const infoUserLoginSlice = createSlice({
    name: 'infoUserLogin',
    initialState: {},
    reducers: {
        setReduxInfoUser: (state, action)=> {
            state = action.payload; 
            return state;
        },
        updateReduxProfileUser: (state, action)=>{
            const data = action.payload;
            const newState={
                ...state,
                "birthday": data.birthday,
                "sex": data.sex,
                "name": data.name,
                "email": data.email,
            }
            return newState;
        },
        updateReduxUser: (state, action)=>{
            const {type, data} = action.payload;
            const newState={
                ...state,
                [type]: data,
            }
            return newState;
        }

    }
});

const { reducer, actions } = infoUserLoginSlice;
export const {
    setReduxInfoUser,
    updateReduxProfileUser,
    updateReduxUser
} = actions;

export default reducer;