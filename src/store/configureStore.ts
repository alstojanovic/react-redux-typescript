import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import reducer from './reducer';
import { alertMiddleware } from './middleware/alert';
// import { thunkMiddleware } from './middleware/thunk';

export function setupStore() {
    return configureStore({
        reducer,
        middleware: [...getDefaultMiddleware(), alertMiddleware],
    });
}

export type StoreState = ReturnType<typeof reducer>;

export type AppThunk = ThunkAction<void, StoreState, unknown, Action<string>>;
