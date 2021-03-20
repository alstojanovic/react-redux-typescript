import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { DepositData } from '../../store/state/deposits';

interface DeleteRowDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    handleDelete: () => void;
    data: DepositData;
}

export const DeleteRowDialog = ({
    isOpen,
    handleClose,
    handleDelete,
    data,
}: DeleteRowDialogProps) => {
    const { bankName } = data;
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isOpen}
        >
            <DialogTitle id="customized-dialog-title">
                Delete deposit
            </DialogTitle>
            <DialogContent>
                <Typography gutterBottom>
                    Are you sure you want to delete your deposit in '{bankName}
                    '?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleDelete}
                    color="secondary"
                    variant="contained"
                >
                    Delete
                </Button>
                <Button
                    onClick={handleClose}
                    color="primary"
                    variant="contained"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
