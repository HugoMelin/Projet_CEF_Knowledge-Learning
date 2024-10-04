import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]{2,}/.test(value);
    const hasMinLength = value.length >= 8;
    const hasMaxLength = value.length <= 100;
    const hasNoSpaces = !/\s/.test(value);
    const isNotCommon = !['Passw0rd', 'Password123'].includes(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && 
                          hasMinLength && hasMaxLength && hasNoSpaces && isNotCommon;

    return !passwordValid ? { invalidPassword: true } : null;
  };
}
