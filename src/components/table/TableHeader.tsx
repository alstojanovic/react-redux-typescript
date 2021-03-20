import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { DepositData } from '../../store/state/deposits';

interface HeadCell {
    id: keyof DepositData;
    label: string;
    align: 'left' | 'right';
}

const headCells: HeadCell[] = [
    {
        id: 'bankName',
        label: 'Bank',
        align: 'left',
    },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'tax', label: 'Tax (%)', align: 'right' },
    {
        id: 'interest',
        label: 'Interest (%)',
        align: 'right',
    },
    { id: 'accountNumber', label: 'Account no.', align: 'right' },
    { id: 'startDate', label: 'Start date', align: 'right' },
    { id: 'endDate', label: 'End date', align: 'right' },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableCell: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            width: '14%',
        },
    })
);

export const TableHeader = () => {
    const classes = useStyles();

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        className={classes.tableCell}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
                <TableCell />
                <TableCell />
            </TableRow>
        </TableHead>
    );
};
