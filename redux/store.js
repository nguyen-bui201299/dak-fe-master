import { configureStore } from '@reduxjs/toolkit'
import infoUserLoginSlice from "./slices/loginSlice.js";
import PostReducer from "./slices/postSlice";
import GroupReducer from "./slices/groupSlice"
import socialListItemsSlice from "./slices/socialSlice.js";


const rootReducer = {
    posts: PostReducer,
    groups: GroupReducer,
    infoUserLogin: infoUserLoginSlice,
    socialListItems: socialListItemsSlice,
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
})
