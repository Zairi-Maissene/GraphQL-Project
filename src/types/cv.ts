import { Skill } from './skill';
import { User } from './user.ts';

export type Cv  = {
  id: string;
  name: string;
  age: number;
  job: string;
  user: User;
}