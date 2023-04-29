import { Cv } from '../types/cv';
import { CvSkill } from '../types/cvSkill';
import { Skill } from '../types/skill';
import { User } from '../types/user.ts';
import { cvs } from './cvs';
import { cvSkills } from './cvSkills';
import { skills } from './skills';
import { users } from './users';

export type ContextType = {
  users: User[],
  cvs: Cv[],
  skills: Skill[],
  cvSkills: CvSkill[],
};
export const context: ContextType = {
  users,
  cvs,
  skills,
  cvSkills,
}