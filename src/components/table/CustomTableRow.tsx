import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Tooltip from '@material-ui/core/Tooltip';

import { DeleteRowDialog } from './DeleteRowDialog';
import { EditableTableRow } from './EditableTableRow';
import { DepositData, deleteDeposit } from '../../store/state/deposits';
import { useDispatch } from 'react-redux';

interface CustomTableRowStyles {
    tableCell: string;
}

interface CustomTableRowProps {
    row: DepositData;
    classes: CustomTableRowStyles;
}

export const CustomTableRow = ({ row, classes }: CustomTableRowProps) => {
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteItem = () => {
        dispatch(deleteDeposit(row._id));
    };

    return (
        <TableRow>
            {isEditMode ? (
                <EditableTableRow
                    row={row}
                    classes={classes}
                    setIsEditMode={setIsEditMode}
                />
            ) : (
                <React.Fragment>
                    <TableCell className={classes.tableCell}>
                        {row.bankName}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        {row.amount}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        {row.tax}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        {row.interest}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        {row.accountNumber}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        {new Date(row.startDate).toDateString()}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        {new Date(row.endDate).toDateString()}
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        <Tooltip title="Edit">
                            <IconButton onClick={() => setIsEditMode(true)}>
                                <EditOutlinedIcon
                                    color="primary"
                                    fontSize="small"
                                />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                        <Tooltip title="Delete">
                            <IconButton onClick={handleOpenDeleteDialog}>
                                <DeleteOutlineIcon
                                    color="secondary"
                                    fontSize="small"
                                />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                    <DeleteRowDialog
                        isOpen={openDeleteDialog}
                        handleClose={handleCloseDeleteDialog}
                        handleDelete={handleDeleteItem}
                        data={row}
                    />
                </React.Fragment>
            )}
        </TableRow>
    );
};
