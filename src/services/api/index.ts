import Api from './config';

import {
    SignInData,
    SignUpData,
    UserAccountData,
    PasswordChangeData,
    DepositUpdateData,
    DepositCreateData,
} from './types';

export async function SignIn(body: SignInData) {
    return await Api.post('/login', body);
}

export async function SignUp(body: SignUpData) {
    return await Api.post('/signup', body);
}

export async function LogOut() {
    return await Api.post('/logout');
}

export async function LoadUser() {
    return await Api.get('/users/me');
}

export async function UpdateAccount(body: UserAccountData) {
    return await Api.patch('/users/update', body);
}

export async function UpdatePassword(body: PasswordChangeData) {
    return await Api.patch('/users/updatePassword', body);
}

export async function LoadDeposits() {
    return await Api.get('/deposits');
}

export async function UpdateDeposit(body: DepositUpdateData, id: number) {
    return await Api.patch(`/deposits/${id}`, body);
}

export async function DeleteDeposit(id: number) {
    return await Api.delete(`/deposits/${id}`);
}

export async function CreateDeposit(body: DepositCreateData) {
    return await Api.post('/deposits', body);
}
