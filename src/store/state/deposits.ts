import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';

import * as ApiService from '../../services/api';
import { DepositCreateData } from '../../services/api/types';
import { createErrorAction, createSuccessAction } from '../middleware/alert';

export interface DepositData {
    _id: number;
    bankName: string;
    accountNumber: number;
    amount: number;
    tax: number;
    interest: number;
    startDate: string;
    endDate: string;
}

const slice = createSlice({
    name: 'deposits',
    initialState: {
        data: [] as DepositData[],
        isLoading: false,
        currentPage: 0,
        rowsPerPage: 10,
        isUpdatingDeposit: false,
        isAddingDeposit: false,
        isAddModalOpen: false,
    },
    reducers: {
        dataLoadStarted: (deposits, action) => {
            deposits.isLoading = true;
        },
        dataLoadSuccess: (deposits, action) => {
            deposits.data = action.payload.data;
            deposits.isLoading = false;
        },
        dataLoadFailed: (deposits, action) => {
            deposits.isLoading = false;
        },
        updateDepositStarted: (deposits, action) => {
            deposits.isUpdatingDeposit = true;
        },
        updateDepositSuccess: (deposits, action) => {
            const updatedDepositIndex = deposits.data.findIndex(
                (element) => element._id === action.payload._id
            );
            deposits.data[updatedDepositIndex] = action.payload;
            deposits.isUpdatingDeposit = false;
        },
        updateDepositFailed: (deposits, action) => {
            deposits.isUpdatingDeposit = false;
        },
        deleteDepositStarted: (deposits, action) => {
            deposits.isLoading = true;
        },
        deleteDepositSuccess: (deposits, action) => {
            deposits.data = deposits.data.filter(
                (element) => element._id !== action.payload.id
            );
            deposits.isLoading = false;
        },
        deleteDepositFailed: (deposits, action) => {
            deposits.data = [action.payload, ...deposits.data];
            deposits.isLoading = false;
        },
        createDepositStarted: (deposits, action) => {
            deposits.isAddingDeposit = true;
        },
        createDepositSuccess: (deposits, action) => {
            deposits.data.unshift(action.payload);
            deposits.isAddingDeposit = false;
        },
        createDepositFailed: (deposits, action) => {
            deposits.isAddingDeposit = false;
        },
        setRowsPerPageSuccess: (deposits, action) => {
            deposits.rowsPerPage = action.payload;
        },
        setCurrentPageSuccess: (deposits, action) => {
            deposits.currentPage = action.payload;
        },
        openAddModalSuccess: (deposits, action) => {
            deposits.isAddModalOpen = true;
        },
        closeAddModalSuccess: (deposits, action) => {
            deposits.isAddModalOpen = false;
        },
    },
});

//  Actions
const {
    dataLoadStarted,
    dataLoadFailed,
    dataLoadSuccess,
    updateDepositStarted,
    updateDepositSuccess,
    updateDepositFailed,
    deleteDepositStarted,
    deleteDepositSuccess,
    deleteDepositFailed,
    createDepositStarted,
    createDepositSuccess,
    createDepositFailed,
    setRowsPerPageSuccess,
    setCurrentPageSuccess,
    openAddModalSuccess,
    closeAddModalSuccess,
} = slice.actions;

// Action creators
export const loadDeposits = () => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: dataLoadStarted.type });

        const { data } = await ApiService.LoadDeposits();

        dispatch({ type: dataLoadSuccess.type, payload: data });
    } catch (error) {
        dispatch({ type: dataLoadFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const updateDeposit = (body: DepositData) => async (
    dispatch: Dispatch
) => {
    try {
        dispatch({ type: updateDepositStarted.type });

        const { data } = await ApiService.UpdateDeposit(body, body._id);

        dispatch({ type: updateDepositSuccess.type, payload: data.data });
        dispatch(createSuccessAction('Deposit details updated'));
    } catch (error) {
        dispatch({ type: updateDepositFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const deleteDeposit = (id: number) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: deleteDepositStarted.type });

        await ApiService.DeleteDeposit(id);

        dispatch({ type: deleteDepositSuccess.type, payload: { id } });
        dispatch(createSuccessAction('Deposit successfully deleted'));
    } catch (error) {
        dispatch({ type: deleteDepositFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const createDeposit = (body: DepositCreateData) => async (
    dispatch: Dispatch
) => {
    try {
        dispatch({ type: createDepositStarted.type });

        const { data } = await ApiService.CreateDeposit(body);

        dispatch({ type: createDepositSuccess.type, payload: data.data });
        dispatch({ type: closeAddModalSuccess.type });
        dispatch(createSuccessAction('Deposit successfully created'));
    } catch (error) {
        dispatch({ type: createDepositFailed.type });
        dispatch(createErrorAction(error.response.data.message));
    }
};

export const setRowsPerPage = (rowsPerPage: number) => (dispatch: Dispatch) => {
    dispatch({ type: setRowsPerPageSuccess.type, payload: rowsPerPage });
};

export const setCurrentPage = (page: number) => (dispatch: Dispatch) => {
    dispatch({ type: setCurrentPageSuccess.type, payload: page });
};

export const openAddModal = () => (dispatch: Dispatch) => {
    dispatch({ type: openAddModalSuccess.type });
};

export const closeAddModal = () => (dispatch: Dispatch) => {
    dispatch({ type: closeAddModalSuccess.type });
};

export default slice.reducer;
