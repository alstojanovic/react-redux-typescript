import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';

import * as ApiService from '../../services/api';
import {
    SignInData,
    SignUpData,
    UserAccountData,
    PasswordChangeData,
} from '../../services/api/types';
import { createErrorAction, createSuccessAction } from '../middleware/alert';

interface AccountUserData {
    firstName: string;
    lastName: string;
    email: string;
}

interface UserData extends AccountUserData {}

const initialUserData = {
    firstName: '',
    lastName: '',
    email: '',
};

const slice = createSlice({
    name: 'auth',
    initialState: {
        user: initialUserData as UserData,
        isLoading: false,
        isLoadingFromToken: true,
        isAuthenticated: false,
        isUpdatingUser: false,
        isUpdatingPassword: false,
    },
    reducers: {
        authStarted: (auth, action) => {
            auth.isLoading = true;
        },
        userAuthenticated: (auth, action) => {
            auth.user = action.payload;
            auth.isLoading = false;
            auth.isAuthenticated = true;
        },
        authFailed: (auth, action) => {
            auth.isLoading = false;
            auth.isAuthenticated = false;
        },
        userLoadStarted: (auth, action) => {
            auth.isLoadingFromToken = true;
        },
        userLoadSuccess: (auth, action) => {
            auth.user = action.payload;
            auth.isLoadingFromToken = false;
            auth.isAuthenticated = true;
        },
        userLoadFailed: (auth, action) => {
            auth.isLoadingFromToken = false;
            auth.isAuthenticated = false;
        },
        userLogOutStarted: (auth, action) => {
            auth.isLoading = true;
        },
        userLogoutSuccess: (auth, action) => {
            auth.user = initialUserData;
            auth.isLoading = false;
            auth.isAuthenticated = false;
        },
        userLogoutFailed: (auth, action) => {
            auth.isLoading = false;
        },
        userUpdateStarted: (auth, action) => {
            auth.isUpdatingUser = true;
        },
        userUpdateSuccess: (auth, action) => {
            auth.user = action.payload;
            auth.isUpdatingUser = false;
        },
        userUpdateFailed: (auth, action) => {
            auth.isUpdatingUser = false;
        },
        passwordUpdateStarted: (auth, action) => {
            auth.isUpdatingPassword = true;
        },
        passwordUpdateSuccess: (auth, action) => {
            auth.user = action.payload;
            auth.isUpdatingPassword = false;
        },
        passwordUpdateFailed: (auth, action) => {
            auth.isUpdatingPassword = false;
        },
    },
});

//  Actions
const {
    authStarted,
    userAuthenticated,
    authFailed,
    userLoadStarted,
    userLoadSuccess,
    userLoadFailed,
    userLogOutStarted,
    userLogoutSuccess,
    userLogoutFailed,
    userUpdateStarted,
    userUpdateSuccess,
    userUpdateFailed,
    passwordUpdateStarted,
    passwordUpdateSuccess,
    passwordUpdateFailed,
} = slice.actions;

// Action creators
export const login = (body: SignInData) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: authStarted.type });
        const { data } = await ApiService.SignIn(body);
        dispatch({ type: userAuthenticated.type, payload: data.user });
    } catch (error) {
        dispatch({ type: authFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const signup = (body: SignUpData) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: authStarted.type });
        const { data } = await ApiService.SignUp(body);
        dispatch({ type: userAuthenticated.type, payload: data.user });
    } catch (error) {
        dispatch({ type: authFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const authUserFromToken = () => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: userLoadStarted.type });

        const { data } = await ApiService.LoadUser();

        dispatch({ type: userLoadSuccess.type, payload: data.data });
    } catch (error) {
        dispatch({ type: userLoadFailed.type });
    }
};

export const logOut = () => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: userLogOutStarted.type });
        await ApiService.LogOut();
        dispatch({ type: userLogoutSuccess.type });
    } catch (error) {
        dispatch({ type: userLogoutFailed.type });
    }
};

export const updateUser = (body: UserAccountData) => async (
    dispatch: Dispatch
) => {
    try {
        dispatch({ type: userUpdateStarted.type });
        const { data } = await ApiService.UpdateAccount(body);
        dispatch({ type: userUpdateSuccess.type, payload: data.user });
        dispatch(createSuccessAction('User details updated'));
    } catch (error) {
        dispatch({ type: userUpdateFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const updatePassword = (body: PasswordChangeData) => async (
    dispatch: Dispatch
) => {
    try {
        dispatch({ type: passwordUpdateStarted.type });
        const { data } = await ApiService.UpdatePassword(body);
        dispatch({ type: passwordUpdateSuccess.type, payload: data.user });
    } catch (error) {
        dispatch({ type: passwordUpdateFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export default slice.reducer;
