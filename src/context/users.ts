import { User } from '../types/user';
import { UserRole } from '../types/user';

export const users: User[] = [
  {
    id: "1",
    name: "name",
    email: "foulen@falte.com",
    role: UserRole.user
  },
  {
    id: "2",
    name: "nassoum",
    email: "nassoum@gmail.com",
    role: UserRole.admin
  },
  {
    id: "3",
    name: "name",
    email: "foulen@falte.com",
    role: UserRole.user
  },
  {
    id: "4",
    name: "name",
    email: "foulen@falte.com",
    role: UserRole.user
  }
]