export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface UserAccountData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export interface DepositUpdateData {
    _id: number;
    bankName: string;
    accountNumber: number;
    amount: number;
    tax: number;
    interest: number;
    startDate: string;
    endDate: string;
}

export interface DepositCreateData {
    bankName: string;
    accountNumber: number;
    amount: number;
    tax: number;
    interest: number;
    startDate: string;
    endDate: string;
}
