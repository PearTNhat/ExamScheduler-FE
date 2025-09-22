import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "../action/user";
const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: {},
        accessToken: null,
        isLoggedIn: false,
        isLoading: false,
        isAdmin: false,
        isError: false
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            // state.userData = action.payload.userData;
            state.isLoggedIn = true;
            //localStorage.setItem("token", action.payload.accessToken);
        },
        setUserData: (state, action) => {
            state.userData = action.payload.userData
        },
        logout: (state) => {
            state.accessToken = null;
            state.isLoggedIn = false;
            state.userData = {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isLoggedIn = true
            state.userData = action.payload
            return state
        })
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.isLoading = false
            state.accessToken = null
            state.isError = true
        })
    }
})
const userActions = userSlice.actions;
const userReducer = userSlice.reducer;
export { userReducer, userActions }