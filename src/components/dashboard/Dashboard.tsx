import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Copyright } from '../common/Copyright';
import { DepositsTable } from '../table/Table';
import { UserProfile } from '../account/Account';
import { PageNotFound } from '../common/PageNotFound';
import { AppMenu } from '../menu/AppMenu';
import { StoreState } from '../../store/configureStore';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const auth = useSelector((state: StoreState) => state.auth);

    if (!auth.isAuthenticated) {
        return <Redirect to="/signin" />;
    }

    return (
        <div className={classes.root}>
            <AppMenu />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Switch>
                            <Route exact path={`/`}>
                                <DepositsTable />
                            </Route>
                            <Route exact path={`/account`}>
                                <UserProfile />
                            </Route>
                            <Route path="*">
                                <PageNotFound />
                            </Route>
                        </Switch>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
}
