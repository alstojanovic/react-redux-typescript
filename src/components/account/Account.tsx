import React, { useState } from 'react';
import * as yup from 'yup';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { UserAccountForm } from './UserAccountForm';
import { StoreState } from '../../store/configureStore';
import { useDispatch, useSelector } from 'react-redux';

import { updateUser, updatePassword } from '../../store/state/auth';

const userProfileValidationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

const changePasswordValidationSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(8, 'Password length should be of minimum 8 characters'),
    newPasswordConfirm: yup
        .string()
        .required('Password confirm is required')
        .equals([yup.ref('newPassword'), ''], "Passwords don't match"),
});

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        borderRadius: '20px',
    },
}));

interface validationError {
    path: keyof formErrors;
    message: string;
}

interface passwordFields {
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}

interface updateProfileFields {
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface formErrors extends updateProfileFields, passwordFields {}

interface validateOnBlurPropType {
    name: string;
    value: string;
}

export const UserProfile = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const auth = useSelector((state: StoreState) => state.auth);
    const { isUpdatingUser, isUpdatingPassword } = auth;
    const { firstName, lastName, email } = auth.user;

    const [errors, setErrors] = useState<formErrors>({});
    const initialPasswordData = {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
    };
    const [passwordData, setPasswordData] = useState(initialPasswordData);
    const [profileData, setProfileData] = useState({
        firstName,
        lastName,
        email,
    });

    const validateData = async (
        schema: yup.BaseSchema,
        data: updateProfileFields | passwordFields
    ) => {
        try {
            await schema.validate(data, {
                abortEarly: false,
            });

            return true;
        } catch (error) {
            const newErrors: formErrors = {};
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
        data: updateProfileFields | passwordFields
    ) => async ({ name }: validateOnBlurPropType) => {
        try {
            await schema.validateAt(name, data);
            const newErrors: formErrors = { ...errors, [name]: undefined };
            setErrors(newErrors);
        } catch (error) {
            const newErrors: formErrors = {
                ...errors,
                [name]: error.errors[0],
            };
            setErrors(newErrors);
        }
    };

    const onBlurProfileFields = (
        e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        validateProperty(
            userProfileValidationSchema,
            profileData
        )(e.currentTarget);
    };

    const onBlurPasswordFields = (
        e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        validateProperty(
            changePasswordValidationSchema,
            passwordData
        )(e.currentTarget);
    };

    const onChangePasswordData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordData = {
            ...passwordData,
            [e.target.name]: e.target.value,
        };

        setPasswordData(newPasswordData);

        validateProperty(
            changePasswordValidationSchema,
            newPasswordData
        )(e.currentTarget);
    };

    const onChangeProfileData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProfileData = {
            ...profileData,
            [e.target.name]: e.target.value,
        };

        setProfileData(newProfileData);

        validateProperty(
            userProfileValidationSchema,
            newProfileData
        )(e.currentTarget);
    };

    const onSubmitUpdateProfile = async () => {
        const isValidForm = await validateData(
            userProfileValidationSchema,
            profileData
        );
        if (isValidForm) {
            dispatch(updateUser(profileData));
        }
    };

    const onSubmitChangePassword = async () => {
        const isValidForm = await validateData(
            changePasswordValidationSchema,
            passwordData
        );
        if (isValidForm) {
            dispatch(updatePassword(passwordData));
        }
    };

    return (
        <Paper className={classes.paper} elevation={3}>
            <UserAccountForm
                passwordData={passwordData}
                profileData={profileData}
                isSubmittingPassword={isUpdatingPassword}
                isSubmittingProfile={isUpdatingUser}
                errors={errors}
                onBlurProfileFields={onBlurProfileFields}
                onBlurPasswordFields={onBlurPasswordFields}
                onChangePasswordData={onChangePasswordData}
                onChangeProfileData={onChangeProfileData}
                onSubmitUpdateProfile={onSubmitUpdateProfile}
                onSubmitChangePassword={onSubmitChangePassword}
            />
        </Paper>
    );
};
