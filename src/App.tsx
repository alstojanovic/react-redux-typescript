import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { AlertList } from './components/alert/AlertList';
import Dashboard from './components/dashboard/Dashboard';
import { authUserFromToken } from './store/state/auth';
import { StoreState } from './store/configureStore';

const useStyles = makeStyles((theme) => ({
    progress: {
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    alerts: {
        width: '40%',
        position: 'absolute',
        top: theme.spacing(1),
        zIndex: theme.zIndex.snackbar,
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
    },
}));

function App() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const auth = useSelector((state: StoreState) => state.auth);

    useEffect(() => {
        dispatch(authUserFromToken());
    }, [dispatch]);

    if (auth.isLoadingFromToken) {
        return <CircularProgress className={classes.progress} />;
    }

    return (
        <Router>
            <Container className={classes.alerts}>
                <AlertList />
            </Container>
            <Switch>
                <Route path="/signin">
                    <SignIn />
                </Route>
                <Route path="/signup">
                    <SignUp />
                </Route>
                <Route path="/">
                    <Dashboard />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
