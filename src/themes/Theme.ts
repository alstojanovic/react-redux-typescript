// import { createMuiTheme } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

export const Theme = createMuiTheme({
    palette: {
        // type: 'dark',
        primary: {
            main: green[600],
        },
        secondary: {
            main: red[500],
        },
    },
    overrides: {
        MuiDialog: {
            paper: { borderRadius: '12px' },
        },
        MuiButton: {
            root: {
                borderRadius: '6px',
            },
        },
    },
});
