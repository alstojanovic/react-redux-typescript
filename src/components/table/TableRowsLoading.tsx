import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progress: {
            color: 'primary',
        },
    })
);

interface TableRowsLoadingProps {
    rowsPerPage: number;
}

export const TableRowsLoading = ({ rowsPerPage }: TableRowsLoadingProps) => {
    const classes = useStyles();
    return (
        <TableRow
            style={{
                height: 61 * rowsPerPage,
            }}
        >
            <TableCell align="center" colSpan={9}>
                <CircularProgress className={classes.progress} />
            </TableCell>
        </TableRow>
    );
};
