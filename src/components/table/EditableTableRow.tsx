import React, { useState } from 'react';
import * as yup from 'yup';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch } from 'react-redux';

import { DepositData, updateDeposit } from '../../store/state/deposits';

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString();
}

const depositValidationSchema = yup.object({
    bankName: yup.string().required('Bank name is required'),
    accountNumber: yup
        .string()
        .required('Field is required')
        .matches(/^\d+$/, 'Only digits')
        .max(17, 'Max 17 digits'),
    amount: yup
        .string()
        .required('Field is required')
        .matches(/^\d+$/, 'Only digits'),
    tax: yup
        .string()
        .required('Field is required')
        .matches(/^\d+$/, 'Only digits'),
    interest: yup
        .string()
        .required('Field is required')
        .matches(/^\d+$/, 'Only digits'),
    startDate: yup.date().nullable().required('Field is required'),
    endDate: yup
        .date()
        .nullable()
        .required('Field is required')
        .min(
            yup.ref('startDate'),
            ({ min }) => `Needs to be after ${formatDate(min)}`
        ),
});

interface validationError {
    path: keyof depositFields;
    message: string;
}

interface depositFields {
    bankName: string;
    accountNumber: number;
    amount: number;
    tax: number;
    interest: number;
    startDate: string;
    endDate: string;
}

interface errorFields {
    bankName?: string;
    accountNumber?: string;
    amount?: string;
    tax?: string;
    interest?: string;
    startDate?: string;
    endDate?: string;
}

interface validateOnBlurPropType {
    name: string;
}

interface EditableTableRowStyles {
    tableCell: string;
}

interface EditableTableRowProps {
    row: DepositData;
    classes: EditableTableRowStyles;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditableTableRow = ({
    row,
    classes,
    setIsEditMode,
}: EditableTableRowProps) => {
    const dispatch = useDispatch();
    const [depositData, setDepositData] = useState<DepositData>(row);
    const {
        bankName,
        accountNumber,
        amount,
        tax,
        interest,
        startDate,
        endDate,
    } = depositData;

    const [errors, setErrors] = useState<errorFields>({});

    const validateData = async (
        schema: yup.BaseSchema,
        data: depositFields
    ) => {
        try {
            await schema.validate(data, {
                abortEarly: false,
            });

            return true;
        } catch (error) {
            const newErrors: errorFields = {};
            error.inner.forEach((err: validationError) => {
                if (!newErrors[err.path]) {
                    newErrors[err.path] = err.message;
                }
            });
            setErrors({ ...errors, ...newErrors });
            return false;
        }
    };

    const validateProperty = (
        schema: yup.BaseSchema,
        data: depositFields
    ) => async ({ name }: validateOnBlurPropType) => {
        try {
            await schema.validateAt(name, data);
            const newErrors: errorFields = { ...errors, [name]: undefined };
            setErrors(newErrors);
        } catch (error) {
            const newErrors: errorFields = {
                ...errors,
                [name]: error.errors[0],
            };
            setErrors(newErrors);
        }
    };

    const onBlurField = (
        e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        validateProperty(depositValidationSchema, depositData)(e.currentTarget);
    };

    const onAcceptDateField = (fieldName: 'startDate' | 'endDate') => (
        date: Date | null
    ) => {
        validateProperty(depositValidationSchema, {
            ...depositData,
            [fieldName]: date,
        })({ name: fieldName });
    };

    const onChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepositData({
            ...depositData,
            [e.target.name]: e.target.value,
        });
    };

    const [
        selectedStartDate,
        setSelectedStartDate,
    ] = React.useState<Date | null>(new Date(startDate));
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(
        new Date(endDate)
    );

    const handleStartDateChange = (date: Date | null) => {
        setSelectedStartDate(date);
        if (date !== null) {
            const newDepositData = {
                ...depositData,
                startDate: date.toDateString(),
            };
            setDepositData(newDepositData);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        setSelectedEndDate(date);
        if (date !== null) {
            const newDepositData = {
                ...depositData,
                endDate: date.toDateString(),
            };
            setDepositData(newDepositData);
        }
    };

    const handleSubmitChanges = async () => {
        const isValidForm = await validateData(
            depositValidationSchema,
            depositData
        );

        if (isValidForm) {
            dispatch(updateDeposit(depositData));
            setIsEditMode(false);
        }
    };

    return (
        <React.Fragment>
            <TableCell className={classes.tableCell}>
                <TextField
                    value={bankName}
                    name="bankName"
                    onChange={onChangeItem}
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                    onBlur={onBlurField}
                />
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                <TextField
                    value={amount}
                    name="amount"
                    onChange={onChangeItem}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    onBlur={onBlurField}
                />
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                <TextField
                    value={tax}
                    name="tax"
                    onChange={onChangeItem}
                    error={!!errors.tax}
                    helperText={errors.tax}
                    onBlur={onBlurField}
                />
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                <TextField
                    value={interest}
                    name="interest"
                    onChange={onChangeItem}
                    error={!!errors.interest}
                    helperText={errors.interest}
                    onBlur={onBlurField}
                />
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                <TextField
                    value={accountNumber}
                    name="accountNumber"
                    onChange={onChangeItem}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber}
                    onBlur={onBlurField}
                />
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableToolbar
                        autoOk
                        variant="inline"
                        format="MM/dd/yy"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        onAccept={onAcceptDateField('startDate')}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                    />
                </MuiPickersUtilsProvider>
            </TableCell>
            <TableCell align="right" className={classes.tableCell}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableToolbar
                        autoOk
                        variant="inline"
                        format="MM/dd/yy"
                        value={selectedEndDate}
                        onChange={handleEndDateChange}
                        onAccept={onAcceptDateField('endDate')}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                    />
                </MuiPickersUtilsProvider>
            </TableCell>
            <TableCell className={classes.tableCell}>
                <Tooltip title="Save">
                    <IconButton onClick={handleSubmitChanges}>
                        <CheckCircleIcon color="primary" fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell className={classes.tableCell}>
                <Tooltip title="Close">
                    <IconButton onClick={() => setIsEditMode(false)}>
                        <CancelIcon color="secondary" fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </React.Fragment>
    );
};
