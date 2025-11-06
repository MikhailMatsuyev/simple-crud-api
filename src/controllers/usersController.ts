import {IUser} from "../interfaces/user";
import {generateId, isValidUUID, validateUserData} from "../utils/validation";

let users: IUser[] = [];

export function getAllUsers(): IUser[] {
    return users;
}

export function getUserById(id: string): { user: IUser | null; error?: string } {
    if (!isValidUUID(id)) {
        return { user: null, error: 'Invalid user ID' };
    }

    const user: IUser | undefined = users.find(u => u.id === id);
    if (!user) {
        return { user: null, error: 'User not found' };
    }

    return { user };
}

export function createUser(userData: any): { user: IUser | null; error?: string } {
    const validation = validateUserData(userData);
    if (!validation.isValid) {
        return { user: null, error: validation.errors.join(', ') };
    }

    const newUser: IUser = {
        id: generateId(),
        username: userData.username,
        age: userData.age,
        hobbies: userData.hobbies || []
    };

    users.push(newUser);
    return { user: newUser };
}

export function updateUser(id: string, userData: any): { user: IUser | null; error?: string } {
    if (!isValidUUID(id)) {
        return { user: null, error: 'Invalid user ID' };
    }

    const validation = validateUserData(userData);
    if (!validation.isValid) {
        return { user: null, error: validation.errors.join(', ') };
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
        return { user: null, error: 'User not found' };
    }

    const updatedUser: IUser = {
        id,
        username: userData.username,
        age: userData.age,
        hobbies: userData.hobbies || []
    };

    users[userIndex] = updatedUser;
    return { user: updatedUser };
}

export function deleteUser(id: string): { success: boolean; error?: string } {
    if (!isValidUUID(id)) {
        return { success: false, error: 'Invalid user ID' };
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
        return { success: false, error: 'User not found' };
    }

    users.splice(userIndex, 1);
    return { success: true };
}

// For testing purposes
export function clearUsers(): void {
    users = [];
}