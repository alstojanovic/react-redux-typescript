import { setAlert } from '../state/alerts';
import { Middleware, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { StoreState } from '../configureStore';
import { AlertType } from '../state/alerts';

interface MiddlewareProp {
    dispatch: ThunkDispatch<StoreState, void, AnyAction>;
}

type AlertActionType = 'alert';
type AlertPayload = { message: string; alertType: AlertType };
type AlertAction = { type: AlertActionType; payload: AlertPayload };

function isAlertAction(action: AnyAction) {
    if (
        action.type === 'alert' &&
        typeof action.payload.message === 'string' &&
        (action.payload.alertType === 'error' ||
            action.payload.alertType === 'info' ||
            action.payload.alertType === 'warning' ||
            action.payload.alertType === 'success')
    ) {
        return true;
    }
    return false;
}

export const alertMiddleware: Middleware = ({ dispatch }: MiddlewareProp) => (
    next
) => (action: AnyAction) => {
    if (isAlertAction(action)) {
        const alertAction = action as AlertAction;
        dispatch(
            setAlert(alertAction.payload.message, alertAction.payload.alertType)
        );
    } else {
        return next(action);
    }
};

const createAlertAction = (
    message: string,
    alertType: AlertType
): AlertAction => ({
    type: 'alert',
    payload: { message, alertType },
});

export const createErrorAction = (message: string): AlertAction => {
    const errorMessage =
        message !== undefined ? message : 'Unknown error occured';
    return createAlertAction(errorMessage, 'error');
};

export const createInfoAction = (message: string): AlertAction =>
    createAlertAction(message, 'info');

export const createWarningAction = (message: string): AlertAction =>
    createAlertAction(message, 'warning');

export const createSuccessAction = (message: string): AlertAction =>
    createAlertAction(message, 'success');
