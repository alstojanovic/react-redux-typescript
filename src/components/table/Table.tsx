import React, { Fragment, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';

import { useDispatch, useSelector } from 'react-redux';

import { StoreState } from '../../store/configureStore';
import { CustomTableRow } from './CustomTableRow';
import {
    loadDeposits,
    setRowsPerPage,
    setCurrentPage,
    openAddModal,
    closeAddModal,
} from '../../store/state/deposits';
import { AddButton } from '../common/AddButton';
import { AddDepositDialog } from './AddDepositDialog';
import { TableRowsLoading } from './TableRowsLoading';
import { TableHeader } from './TableHeader';
import { EmptyRows } from './EmptyRows';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
            borderRadius: '20px',
        },
        table: {
            minWidth: 750,
        },
        tableCell: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            width: '14%',
        },
    })
);

export const DepositsTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const deposits = useSelector((state: StoreState) => state.deposits);
    const {
        data,
        rowsPerPage,
        currentPage,
        isLoading,
        isAddModalOpen,
    } = deposits;

    useEffect(() => {
        dispatch(loadDeposits());
    }, [dispatch]);

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch(setCurrentPage(newPage));
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
        setCurrentPage(0);
    };

    // handle delete only item on the last page
    // (the Material UI Pagination throws a warrning with currentPage out of scope)
    const maxPage = data.length / rowsPerPage;
    const isPageNumberValid = !(maxPage > 0 && currentPage === maxPage);
    useEffect(() => {
        if (maxPage > 0 && currentPage === maxPage) {
            dispatch(setCurrentPage(maxPage - 1));
        }
    }, [data, rowsPerPage, currentPage, maxPage, dispatch]);

    const handleCloseAddDepositDialog = () => {
        dispatch(closeAddModal());
    };
    const handleOpenAddDepositDialog = () => {
        dispatch(openAddModal());
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <AddButton onClick={handleOpenAddDepositDialog} />
                {isAddModalOpen && (
                    <AddDepositDialog
                        isOpen={isAddModalOpen}
                        onClose={handleCloseAddDepositDialog}
                    />
                )}
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <TableHeader />
                        <TableBody>
                            {isLoading ? (
                                <TableRowsLoading rowsPerPage={rowsPerPage} />
                            ) : (
                                <Fragment>
                                    {data
                                        .slice(
                                            currentPage * rowsPerPage,
                                            currentPage * rowsPerPage +
                                                rowsPerPage
                                        )
                                        .map((row, index) => {
                                            return (
                                                <CustomTableRow
                                                    row={row}
                                                    classes={classes}
                                                    key={row._id}
                                                />
                                            );
                                        })}
                                    <EmptyRows />
                                </Fragment>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {isPageNumberValid && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )}
            </Paper>
        </div>
    );
};
