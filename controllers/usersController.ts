import { User, UserWithoutId } from '../types/user';
import { isValidUUID, validateUserData, generateId } from '../utils/validation';

// In-memory database
let users: User[] = [];

export const getAllUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): { user: User | null; error?: string } => {
  if (!isValidUUID(id)) {
    return { user: null, error: 'Invalid user ID' };
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return { user: null, error: 'User not found' };
  }

  return { user };
};

export const createUser = (userData: any): { user: User | null; error?: string } => {
  const validation = validateUserData(userData);
  if (!validation.isValid) {
    return { user: null, error: validation.errors.join(', ') };
  }

  const newUser: User = {
    id: generateId(),
    username: userData.username,
    age: userData.age,
    hobbies: userData.hobbies || []
  };

  users.push(newUser);
  return { user: newUser };
};

export const updateUser = (id: string, userData: any): { user: User | null; error?: string } => {
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

  const updatedUser: User = {
    id,
    username: userData.username,
    age: userData.age,
    hobbies: userData.hobbies || []
  };

  users[userIndex] = updatedUser;
  return { user: updatedUser };
};

export const deleteUser = (id: string): { success: boolean; error?: string } => {
  if (!isValidUUID(id)) {
    return { success: false, error: 'Invalid user ID' };
  }

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  users.splice(userIndex, 1);
  return { success: true };
};

// For testing purposes
export const clearUsers = (): void => {
  users = [];
};