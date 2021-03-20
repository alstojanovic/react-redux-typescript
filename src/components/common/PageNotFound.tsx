import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export const PageNotFound = () => {
    return (
        <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: '50vh' }}
        >
            <Typography variant="h3" component="h2" align="center">
                Page Not Found
            </Typography>
        </Grid>
    );
};
