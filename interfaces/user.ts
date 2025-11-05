export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUserWithoutId {
  username: string;
  age: number;
  hobbies: string[];
}