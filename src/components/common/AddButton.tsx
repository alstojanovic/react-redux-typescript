import React, { Fragment } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        addButton: {
            position: 'absolute',
            bottom: theme.spacing(5),
            right: theme.spacing(3),
        },
    })
);

interface AddButtonProps {
    onClick?: () => void;
}

export const AddButton = ({ ...props }: AddButtonProps) => {
    const classes = useStyles();

    return (
        <Fragment>
            <Tooltip title="Add" aria-label="add">
                <Fab color="secondary" className={classes.addButton} {...props}>
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Fragment>
    );
};
