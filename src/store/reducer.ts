import { combineReducers } from 'redux';
import authReducer from './state/auth';
import alertReducer from './state/alerts';
import depositsReducer from './state/deposits';

export default combineReducers({
    auth: authReducer,
    alerts: alertReducer,
    deposits: depositsReducer,
});
