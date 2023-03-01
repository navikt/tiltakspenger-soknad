import { FieldError, FieldErrors } from 'react-hook-form';

export default function findAllErrors(currentErrors: FieldErrors, listOfErrors: Array<FieldError>): Array<FieldError> {
    const fieldErrors = Object.values(currentErrors);
    fieldErrors.forEach((value) => {
        const fieldError = value as FieldError;
        if (!fieldError.ref) {
            findAllErrors(value as FieldErrors, listOfErrors);
        } else {
            listOfErrors.push(fieldError);
        }
    });
    return listOfErrors;
}
