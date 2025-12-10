import { ValidationError } from 'class-validator';

export function flattenValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const err of errors) {
    if (err.constraints) {
      for (const key in err.constraints) {
        messages.push(`${err.property} ${err.constraints[key]}`);
      }
    }
    if (err.children && err.children.length > 0) {
      messages.push(...flattenValidationErrors(err.children));
    }
  }

  return messages;
}