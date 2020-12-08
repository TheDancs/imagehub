import React from "react";
import { Alert, AlertTitle } from '@material-ui/lab';

export function ShowError(title, message) {
    return (
        <Alert severity="error">
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
}

export function ShowWarning(title, message) {
    return (
        <Alert severity="warning">
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
}
export function ShowInfo(title, message) {
    return (
        <Alert severity="info">
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
}
export function ShowSuccess(title, message) {
    return (
        <Alert severity="success">
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
}
