import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export function isValidUUID(id: string): boolean {
    return uuidValidate(id);
}

export function validateUserData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
        errors.push('Request body must be a valid JSON object');
        return { isValid: false, errors };
    }

    if (!data.username || typeof data.username !== 'string') {
        errors.push('Username is required and must be a string');
    }

    if (data.age === undefined || typeof data.age !== 'number' || data.age < 0) {
        errors.push('Age is required and must be a non-negative number');
    }

    if (!Array.isArray(data.hobbies)) {
        errors.push('Hobbies is required and must be an array');
    } else if (!data.hobbies.every((hobby: any) => typeof hobby === 'string')) {
        errors.push('All hobbies must be strings');
    }

    return { isValid: errors.length === 0, errors };
}

export function generateId(): string {
    return uuidv4();
}