export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
export enum UserRole {
  user= 'user',
  admin= 'admin',
}
