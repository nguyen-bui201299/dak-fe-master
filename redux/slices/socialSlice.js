import { createSlice } from '@reduxjs/toolkit';

const initialState = [
    "twitter",
    "instagram",
    "facebook",
    "tiktok" ,
    "youtube",
    "twitch",
    "with_friend"];


const socialListItemsSlice = createSlice({
    name: 'socialListItems',
    initialState,
    reducers: {
        setItemSocialList: (state, action) => {
            // console.log('action.payload: ',action.payload)
            state = action.payload;
            return state;
        },
        addSocialItem: (state, action) => {
            if(state.length == 7) return;
            state.push(action.payload);
        },
        removeSocialItem: (state, action) => {  
            if(state.length == 1) return;
            const index = state.indexOf(action.payload);
            state.splice(index, 1);
        }
    }
});

const {reducer, actions} = socialListItemsSlice;

export const {
    setItemSocialList,
    addSocialItem,
    removeSocialItem
} = actions;

export default reducer;