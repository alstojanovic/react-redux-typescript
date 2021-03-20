import React, { useState, useMemo } from 'react';
import * as yup from 'yup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgress } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch, useSelector } from 'react-redux';

import { StoreState } from '../../store/configureStore';
import { createDeposit } from '../../store/state/deposits';

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString();
}

const depositValidationSchema = yup.object({
    bankName: yup.string().required('Bank name is required'),
    accountNumber: yup
        .string()
        .required('Account number is required')
        .matches(/^\d+$/, 'Account number can contain only digits')
        .max(17, 'Account number can have a maximum of 17 digits'),
    amount: yup
        .string()
        .required('Amount is required')
        .matches(/^\d+$/, 'Amount can contain only digits'),
    tax: yup
        .string()
        .required('Tax is required')
        .matches(/^\d+$/, 'Tax can contain only digits'),
    interest: yup
        .string()
        .required('Interest is required')
        .matches(/^\d+$/, 'Interest can contain only digits'),
    startDate: yup.date().nullable().required('Start date is required'),
    endDate: yup
        .date()
        .nullable()
        .required('End date is required')
        .min(
            yup.ref('startDate'),
            ({ min }) => `End date has to be after ${formatDate(min)}`
        ),
});

interface validationError {
    path: keyof depositFields;
    message: string;
}

interface depositFields {
    bankName: string;
    accountNumber: string;
    amount: string;
    tax: string;
    interest: string;
    startDate: Date | null;
    endDate: Date | null;
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

interface AddDepositDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        buttonProgress: {
            color: 'primary',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    })
);

export const AddDepositDialog = ({
    isOpen,
    onClose: handleClose,
}: AddDepositDialogProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const deposits = useSelector((state: StoreState) => state.deposits);
    const { isAddingDeposit } = deposits;

    const initialDepositData = useMemo(() => {
        return {
            bankName: '',
            accountNumber: '',
            amount: '',
            tax: '',
            interest: '',
            startDate: null,
            endDate: null,
        };
    }, []);
    const [depositData, setDepositData] = useState<depositFields>(
        initialDepositData
    );
    const { bankName, amount, tax, interest, accountNumber } = depositData;

    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [errors, setErrors] = useState<errorFields>({});

    const onChangeStartDate = (date: Date | null) => {
        setStartDate(date);
        const newDepositData = {
            ...depositData,
            startDate: date,
        };

        setDepositData(newDepositData);
    };

    const onChangeEndDate = (date: Date | null) => {
        setEndDate(date);
        const newDepositData = {
            ...depositData,
            endDate: date,
        };

        setDepositData(newDepositData);
    };

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

    const onBlurDepositFields = (
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

    const onChangeDepositData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDepositData = {
            ...depositData,
            [e.target.name]: e.target.value,
        };

        setDepositData(newDepositData);
    };

    const onSubmit = async () => {
        const isValidForm = await validateData(
            depositValidationSchema,
            depositData
        );

        if (isValidForm) {
            const submitData = {
                bankName: depositData.bankName,
                accountNumber: +depositData.accountNumber,
                amount: +depositData.amount || 0,
                tax: +depositData.tax || 0,
                interest: +depositData.interest || 0,
                startDate: startDate?.toISOString() || '',
                endDate: endDate?.toISOString() || '',
            };

            dispatch(createDeposit(submitData));
        }
    };

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            open={isOpen}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="customized-dialog-title">
                Create New Deposit
                <IconButton
                    onClick={handleClose}
                    className={classes.closeButton}
                    disabled={isAddingDeposit}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Please fill all fields to create a deposit.
                </DialogContentText>
                <form>
                    <Grid item xs={8}>
                        <TextField
                            margin="normal"
                            label="Bank name"
                            fullWidth
                            value={bankName}
                            name="bankName"
                            onChange={onChangeDepositData}
                            error={!!errors.bankName}
                            helperText={errors.bankName}
                            onBlur={onBlurDepositFields}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            margin="normal"
                            label="Amount"
                            fullWidth
                            value={amount}
                            name="amount"
                            onChange={onChangeDepositData}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            onBlur={onBlurDepositFields}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            margin="normal"
                            label="Tax %"
                            fullWidth
                            value={tax}
                            name="tax"
                            onChange={onChangeDepositData}
                            error={!!errors.tax}
                            helperText={errors.tax}
                            onBlur={onBlurDepositFields}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            margin="normal"
                            label="Interest %"
                            fullWidth
                            value={interest}
                            name="interest"
                            onChange={onChangeDepositData}
                            error={!!errors.interest}
                            helperText={errors.interest}
                            onBlur={onBlurDepositFields}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            margin="normal"
                            label="Account no."
                            fullWidth
                            value={accountNumber}
                            name="accountNumber"
                            onChange={onChangeDepositData}
                            error={!!errors.accountNumber}
                            helperText={errors.accountNumber}
                            onBlur={onBlurDepositFields}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                disableToolbar
                                variant="inline"
                                label="Start date"
                                fullWidth
                                autoOk
                                margin="normal"
                                format="dd/MM/yy"
                                value={startDate}
                                name="startDate"
                                onChange={onChangeStartDate}
                                onAccept={onAcceptDateField('startDate')}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={8}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                disableToolbar
                                variant="inline"
                                label="End date"
                                fullWidth
                                autoOk
                                margin="normal"
                                format="dd/MM/yy"
                                value={endDate}
                                name="endDate"
                                onChange={onChangeEndDate}
                                onAccept={onAcceptDateField('endDate')}
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="primary"
                    disabled={isAddingDeposit}
                >
                    Cancel
                </Button>
                <Button
                    autoFocus
                    onClick={onSubmit}
                    color="primary"
                    variant="contained"
                    disabled={isAddingDeposit}
                >
                    Add deposit
                    {isAddingDeposit && (
                        <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                        />
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
