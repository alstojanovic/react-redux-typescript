import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(3, 0, 2),
    },
    buttonProgress: {
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

interface passwordFields {
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}
interface profileFields {
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface formErrors extends profileFields, passwordFields {}

interface propTypes {
    passwordData: passwordFields;
    profileData: profileFields;
    isSubmittingPassword: boolean;
    isSubmittingProfile: boolean;
    errors: formErrors;
    onBlurProfileFields: (
        e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
    onBlurPasswordFields: (
        e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
    onChangePasswordData: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeProfileData: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmitUpdateProfile: () => void;
    onSubmitChangePassword: () => void;
}

export const UserAccountForm = ({
    passwordData,
    profileData,
    isSubmittingPassword,
    isSubmittingProfile,
    errors,
    onBlurProfileFields,
    onBlurPasswordFields,
    onChangePasswordData,
    onChangeProfileData,
    onSubmitUpdateProfile,
    onSubmitChangePassword,
}: propTypes) => {
    const classes = useStyles();

    const { currentPassword, newPassword, newPasswordConfirm } = passwordData;

    const { firstName, lastName, email } = profileData;

    return (
        <form>
            <CardHeader title={'Update Profile'} />
            <Grid item xs={4}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    label="First name"
                    name="firstName"
                    fullWidth
                    value={firstName}
                    onChange={onChangeProfileData}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    onBlur={onBlurProfileFields}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    label="Last name"
                    name="lastName"
                    fullWidth
                    value={lastName}
                    onChange={onChangeProfileData}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    onBlur={onBlurProfileFields}
                />
            </Grid>

            <Grid item xs={4}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    label="Email address"
                    name="email"
                    fullWidth
                    value={email}
                    onChange={onChangeProfileData}
                    error={!!errors.email}
                    helperText={errors.email}
                    onBlur={onBlurProfileFields}
                />
            </Grid>
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmittingProfile}
                onClick={onSubmitUpdateProfile}
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                Save
                {isSubmittingProfile && (
                    <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                    />
                )}
            </Button>

            <CardHeader title={'Change Password'} />
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="currentPassword"
                        label="Current password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={onChangePasswordData}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword}
                        onBlur={onBlurPasswordFields}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="newPassword"
                        label="New password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={onChangePasswordData}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                        onBlur={onBlurPasswordFields}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="newPasswordConfirm"
                        label="Confirm new password"
                        type="password"
                        fullWidth
                        value={newPasswordConfirm}
                        onChange={onChangePasswordData}
                        error={!!errors.newPasswordConfirm}
                        helperText={errors.newPasswordConfirm}
                        onBlur={onBlurPasswordFields}
                    />
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                disabled={isSubmittingPassword}
                onClick={onSubmitChangePassword}
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                Save
                {isSubmittingPassword && (
                    <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                    />
                )}
            </Button>
        </form>
    );
};
