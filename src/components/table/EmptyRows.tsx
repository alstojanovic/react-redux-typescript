import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store/configureStore';

export const EmptyRows = () => {
    const deposits = useSelector((state: StoreState) => state.deposits);
    const { data, rowsPerPage, currentPage } = deposits;

    const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, data.length - currentPage * rowsPerPage);

    if (emptyRows === 0) return <React.Fragment />;

    return (
        <TableRow style={{ height: 61 * emptyRows }}>
            <TableCell colSpan={9} align="center">
                No Deposits Yet
            </TableCell>
        </TableRow>
    );
};
