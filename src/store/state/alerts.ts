import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch } from 'redux';

import { StoreState, AppThunk } from '../configureStore';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

interface Alert {
    id: string;
    message: string;
    severity: AlertType;
}

const initialState: Alert[] = [];

const slice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        alertAdded: (alerts, action) => {
            if (alerts.length === 3) alerts.pop();
            alerts.push(action.payload);
        },
        alertRemoved: (alerts, action) => {
            return [
                ...alerts.filter((alert) => alert.id !== action.payload.id),
            ];
        },
    },
});

const { alertAdded, alertRemoved } = slice.actions;

export const setAlert = (
    message: string,
    severity: AlertType,
    timeout = 4000
): AppThunk => (dispatch: Dispatch, getState: () => StoreState) => {
    const id = uuidv4();
    dispatch({ type: alertAdded.type, payload: { id, message, severity } });

    setTimeout(() => {
        if (getState().alerts.find((alert) => alert.id === id))
            dispatch({ type: alertRemoved.type, payload: { id } });
    }, timeout);
};

export const removeAlert = (id: string) => (
    dispatch: Dispatch,
    getState: () => StoreState
) => {
    dispatch({ type: alertRemoved.type, payload: { id } });
};

export default slice.reducer;
