import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../store/configureStore';
import { removeAlert } from '../../store/state/alerts';

const useStyles = makeStyles((theme) => ({
    alerts: {
        '& > * + *': {
            marginTop: theme.spacing(1),
        },
    },
}));

export const AlertList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const alerts = useSelector((state: StoreState) => state.alerts);

    return (
        <div className={classes.alerts}>
            {alerts.map((alert) => (
                <Alert
                    severity={alert.severity}
                    key={alert.id}
                    onClose={() => dispatch(removeAlert(alert.id))}
                >
                    {alert.message}
                </Alert>
            ))}
        </div>
    );
};
