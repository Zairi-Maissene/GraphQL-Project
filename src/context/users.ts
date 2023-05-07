import { User } from '../types/user';
import { UserRole } from '../types/user';

export const users: User[] = [
  {
    id: "1",
    name: "name1",
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
    name: "name3",
    email: "foulen@falte.com",
    role: UserRole.user
  },
  {
    id: "4",
    name: "name4",
    email: "foulen@falte.com",
    role: UserRole.user
  }
]